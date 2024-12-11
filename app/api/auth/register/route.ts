import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    
    if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(name)) {
      return NextResponse.json(
        { error: '用户名只能包含字母、数字和中文' },
        { status: 400 }
      )
    }

    const passwordRules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    if (!passwordRules.minLength || !passwordRules.hasUpperCase || 
        !passwordRules.hasLowerCase || !passwordRules.hasNumber || 
        !passwordRules.hasSpecialChar) {
      return NextResponse.json(
        { 
          error: '密码必须满足：长度大于8位、包含大小写字母、数字和特殊字符',
          details: passwordRules 
        },
        { status: 400 }
      )
    }

    console.log('Registration attempt for:', email)

    try {
      await prisma.$connect()
      console.log('Database connected successfully')

      await prisma.$queryRaw`SELECT 1`
      console.log('Database query successful')

      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        console.log('Email already exists:', email)
        return NextResponse.json(
          { error: '邮箱已被注册' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      console.log('Password hashed successfully')

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      })

      console.log('User created:', user.id)
      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name
      })

    } catch (error: unknown) {
      console.error('Database error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        code: error instanceof Error && 'code' in error ? error.code : undefined,
        stack: error instanceof Error ? error.stack : undefined
      })
      return NextResponse.json(
        { error: '数据库错误', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: '请求处理错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
} 
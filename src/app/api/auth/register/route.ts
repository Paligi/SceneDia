import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

// 验证规则
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 100
const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 50

// 密码验证规则：至少包含一个大写字母，一个小写字母，一个数字
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

// 名字验证规则：只允许字母、空格和常见标点符号
const NAME_PATTERN = /^[a-zA-Z\s\-'.]+$/

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    // 验证邮箱
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 验证密码
    if (!password || 
        password.length < PASSWORD_MIN_LENGTH || 
        password.length > PASSWORD_MAX_LENGTH) {
      return NextResponse.json(
        { error: `密码长度必须在 ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} 个字符之间` },
        { status: 400 }
      )
    }

    if (!PASSWORD_PATTERN.test(password)) {
      return NextResponse.json(
        { error: '密码必须包含至少一个大写字母、一个小写字母和一个数字' },
        { status: 400 }
      )
    }

    // 验证名字
    if (name) {  // 因为 name 是可选的 (String?)
      if (name.length < NAME_MIN_LENGTH || 
          name.length > NAME_MAX_LENGTH) {
        return NextResponse.json(
          { error: `名字长度必须在 ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} 个字符之间` },
          { status: 400 }
        )
      }

      if (!NAME_PATTERN.test(name)) {
        return NextResponse.json(
          { error: '名字只能包含字母、空格和常见标点符号' },
          { status: 400 }
        )
      }
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    return NextResponse.json({ 
      user: { 
        email: user.email, 
        name: user.name 
      },
      message: '注册成功'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 
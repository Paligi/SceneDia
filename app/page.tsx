'use client'

import { useState } from 'react'
import { scenarios, Scenario } from '../data/scenarios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Button from "@/components/ui/Button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SpeechComponent } from '../components/SpeechComponent'
import { ScenarioTest } from '../components/ScenarioTest'
import { WordList } from '../components/WordList'
import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'

export default function LanguageLearningApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [isTestMode, setIsTestMode] = useState(false)
  const [isExpressionsExpanded, setIsExpressionsExpanded] = useState(false);
  const [showRegister, setShowRegister] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '登录失败')
      }

      const user = await response.json()
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Login error:', error)
      // 这里可以添加错误提示
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentScenario(null)
    setIsTestMode(false)
  }

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      setRegistrationSuccess(true)
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          {registrationSuccess ? (
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-green-600">注册成功！</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center">您的账号已创建成功</p>
                <Button 
                  onClick={() => {
                    setShowRegister(false)
                    setRegistrationSuccess(false)
                  }}
                  className="w-full"
                >
                  返回登录
                </Button>
              </CardContent>
            </Card>
          ) : showRegister ? (
            <RegisterForm 
              onRegister={handleRegister}
              onBack={() => setShowRegister(false)}
            />
          ) : (
            <LoginForm 
              onLogin={handleLogin}
              onRegister={() => setShowRegister(true)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            退出登录
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-12">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
              <span className="font-noto bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                交互场景对话学习
              </span>
            </h1>
            <p className="font-noto text-lg text-zinc-600 dark:text-zinc-400 max-w-[600px] mx-auto">
              选择场景，开始练习
            </p>
          </div>

          {!currentScenario ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {scenarios.map((scenario) => (
                <Card 
                  key={scenario.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-zinc-50 dark:bg-zinc-900"
                >
                  <CardHeader>
                    <CardTitle className="font-noto text-2xl font-medium text-zinc-900 dark:text-zinc-100">
                      {scenario.name}
                    </CardTitle>
                    <CardDescription className="font-noto text-zinc-600 dark:text-zinc-400">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setCurrentScenario(scenario)}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-noto"
                    >
                      开始学习
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-8">
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setCurrentScenario(null)
                    setIsTestMode(false)
                  }}
                >
                  返回场景列表
                </Button>
                {!isTestMode && (
                  <Button 
                    onClick={() => setIsTestMode(true)}
                  >
                    开始测试
                  </Button>
                )}
              </div>

              {!isTestMode ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentScenario.name}</CardTitle>
                      <CardDescription>{currentScenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WordList words={currentScenario.words} />
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">常用句</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpressionsExpanded(!isExpressionsExpanded)}
                            className="flex items-center gap-1"
                          >
                            {isExpressionsExpanded ? (
                              <>
                                收起 <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                展开 <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>

                        {isExpressionsExpanded && (
                          <ScrollArea className="h-[400px] rounded-md border p-4">
                            {currentScenario.expressions.map((expression, index) => (
                              <div 
                                key={index} 
                                className="mb-4 p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
                              >
                                <p className="font-medium font-noto">{expression.original}</p>
                                <p className="text-zinc-600 dark:text-zinc-400 mt-1">{expression.translation}</p>
                                <div className="mt-2">
                                  <SpeechComponent 
                                    text={expression.translation} 
                                    onRecordingComplete={(transcript, audioUrl) => {
                                      console.log('Transcript:', transcript);
                                      console.log('Audio URL:', audioUrl);
                                    }} 
                                  />
                                </div>
                              </div>
                            ))}
                          </ScrollArea>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <ScenarioTest 
                  dialogue={currentScenario.dialogue}
                  scenario={currentScenario.name}
                  onComplete={() => setIsTestMode(false)} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react';
import OpenAI from "openai";
import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function APITest() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    setResult('测试中...');

    try {
      // 首先检查 API key
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found in environment variables');
      }

      console.log('API Key available:', apiKey.slice(0, 5) + '...');

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      // 创建测试音频
      const audioContext = new AudioContext();
      const buffer = audioContext.createBuffer(1, 44100, 44100);
      const arrayBuffer = buffer.getChannelData(0);
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const file = new File([blob], 'test.wav', { type: 'audio/wav' });

      setResult('API key 已找到，正在测试连接...');

      // 测试 API 调用
      const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: file,
        language: 'zh',
      });

      setResult(`API 测试成功!\n\n响应数据:\n${JSON.stringify(response, null, 2)}`);
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
      setResult(`API 测试失败:\n${error instanceof Error ? error.message : String(error)}\n\n请确保：\n1. .env.local 文件中已设置 NEXT_PUBLIC_OPENAI_API_KEY\n2. API key 格式正确\n3. 已重启开发服务器`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API 连接测试</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testAPI}
          disabled={isLoading}
        >
          {isLoading ? '测试中...' : '测试 API 连接'}
        </Button>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <pre className="whitespace-pre-wrap">
            {result || '点击按钮开始测试...'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
} 
'use client'

import React, { useState, useRef } from 'react'
import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DialogueSimulationProps {
  scenario: string;
  onComplete: (feedback: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

export function DialogueSimulation({ scenario, onComplete }: DialogueSimulationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startSimulation = async () => {
    setConversation([]);
    
    // 开始场景对话
    const initialMessage = `Let's practice a ${scenario} scenario. I'll be the ${
      scenario === 'restaurant' ? 'waiter' : 
      scenario === 'airport' ? 'check-in staff' :
      scenario === 'hotel' ? 'receptionist' : 'staff'
    }. How can I help you?`;

    // 添加并播放初始消息
    await addAssistantMessage(initialMessage);
    
    // 设置录音状态为 true，允许用户开始录音
    setIsRecording(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // 添加用户的语音消息
        setConversation(prev => [...prev, {
          role: 'user',
          content: '正在处理语音...',
          audioUrl
        }]);

        await processUserResponse(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const processUserResponse = async (audioBlob: Blob) => {
    try {
      const transcriptionFormData = new FormData();
      transcriptionFormData.append('file', audioBlob, 'audio.wav');
      transcriptionFormData.append('model', 'whisper-1');
      transcriptionFormData.append('language', 'en');

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: transcriptionFormData
      });

      const transcriptionData = await transcriptionResponse.json();
      const userMessage = transcriptionData.text;

      // 更新最后一条消息，保留音频URL
      setConversation(prev => [
        ...prev.slice(0, -1),
        {
          role: 'user',
          content: userMessage,
          audioUrl: prev[prev.length - 1].audioUrl
        }
      ]);

      // 2. 获取助手回复
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `你是一个在${scenario}场景中的服务人员。请根据用户的回答继续对话。每次回复要简短，并引导用户继续对话。当场景对话自然结束时，说"Thank you for practicing with me."。`
            },
            ...conversation,
            { role: 'user', content: userMessage }
          ]
        })
      });

      const chatData = await chatResponse.json();
      const assistantMessage = chatData.choices[0].message.content;

      // 如果对话结束，结束模拟
      if (assistantMessage.includes('Thank you for practicing with me')) {
        await addAssistantMessage(assistantMessage);
        endSimulation();
        return;
      }

      // 添加并播放助手消息
      await addAssistantMessage(assistantMessage);

    } catch (error) {
      console.error('Error processing response:', error);
    }
  };

  const addAssistantMessage = async (message: string) => {
    // 添加助手消息到对话
    setConversation(prev => [...prev, { role: 'assistant', content: message }]);

    // 转换为语音并播放
    try {
      const speechResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: message,
          voice: 'alloy',
          speed: 0.9
        })
      });

      const audioBlob = await speechResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const endSimulation = async () => {
    setIsRecording(false);

    // 获取评估反馈
    try {
      const feedbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: '你是一个英语口语教练。请用中文对学生的口表现进行评估，指出优点和需要改进的地方。'
            },
            {
              role: 'user',
              content: `场景：${scenario}\n对话记录：${JSON.stringify(conversation)}`
            }
          ]
        })
      });

      const feedbackData = await feedbackResponse.json();
      const feedbackText = feedbackData.choices[0].message.content;
      setFeedback(feedbackText);
      onComplete(feedbackText);
    } catch (error) {
      console.error('Error getting feedback:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>场景模拟对话</span>
          {isRecording && (
            <span className="text-sm text-red-500 animate-pulse">● 录音中</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-4">
          {!conversation.length ? (
            <Button onClick={startSimulation}>
              开始对话
            </Button>
          ) : !isRecording ? (
            <Button onClick={startRecording}>
              开始回答
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                onClick={stopRecording}
                className="animate-pulse"
              >
                结束录音
              </Button>
            </div>
          )}
        </div>

        <div className="h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg">
          {conversation.length === 0 ? (
            <div className="text-center text-muted-foreground">
              点击"开始对话"开始练习
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium mb-1 flex items-center justify-between">
                    <span>{message.role === 'user' ? '你' : '助手'}</span>
                    {message.audioUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => new Audio(message.audioUrl).play()}
                        className="ml-2 p-1 h-6"
                      >
                        🔊
                      </Button>
                    )}
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {feedback && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">评估反馈：</h3>
            <p className="text-muted-foreground">{feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
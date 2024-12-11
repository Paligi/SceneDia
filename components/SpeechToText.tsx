'use client'

import React, { useState, useRef } from 'react';
import Button from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // 允许在浏览器端使用
});

interface SpeechToTextProps {
  onBack?: () => void;
}

export function SpeechToText({ onBack }: SpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setShowResult(false);
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
        await transcribeAudio(audioBlob);
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

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setTranscribedText('转换中...');
      
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: new File([audioBlob], 'audio.wav', { type: 'audio/wav' }),
        language: 'zh',
        prompt: '这是一段中文语音',
        temperature: 0,
        response_format: 'json'
      });

      console.log('Transcription result:', response);

      if (response.text) {
        setTranscribedText(response.text);
        setShowResult(true);
      } else {
        throw new Error('No transcription in response');
      }

    } catch (error) {
      console.error('Transcription error:', error);
      setTranscribedText(error instanceof Error ? error.message : '转换失败，请重试');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>语音转文字测试</span>
          {isRecording && (
            <span className="text-sm text-red-500 animate-pulse">● 录音中</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showResult ? (
          <div className="flex justify-center gap-4">
            <Button 
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? "停止录音" : "开始录音"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">转换结果：</h3>
              <p className="text-muted-foreground">
                {transcribedText}
              </p>
              {audioUrl && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">原始语音：</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => new Audio(audioUrl).play()}
                  >
                    播放
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={startRecording}>
                重新测试
              </Button>
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  返回场景测试
                </Button>
              )}
            </div>
          </div>
        )}

        {!showResult && (
          <div className="mt-4 p-4 bg-muted rounded-lg min-h-[100px]">
            <h3 className="font-semibold mb-2">转换结果：</h3>
            <p className="text-muted-foreground">
              {transcribedText || '点击"开始录音"开始测试...'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
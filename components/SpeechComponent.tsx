'use client'

import React, { useState, useRef } from 'react';
import Button from "../components/ui/Button"

interface SpeechComponentProps {
  text: string;
  onRecordingComplete: (transcript: string, audioUrl: string) => void;
}

export function SpeechComponent({ text, onRecordingComplete }: SpeechComponentProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);

          const recognition = new (window as any).webkitSpeechRecognition();
          recognition.lang = 'en-US';
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onRecordingComplete(transcript, audioUrl);
          };
          recognition.start();
        });

        mediaRecorder.start();
        setIsRecording(true);

        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 30000); // 30 seconds
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={speak}>播放文本</Button>
      <Button onClick={startRecording} disabled={isRecording}>
        {isRecording ? '正在录音...' : '开始录音'}
      </Button>
      {isRecording && (
        <Button onClick={stopRecording}>停止录音</Button>
      )}
      {audioUrl && (
        <audio controls src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}


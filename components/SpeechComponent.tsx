'use client'

import React, { useState, useRef, useEffect } from 'react';
import Button from "../components/ui/Button"

interface SpeechComponentProps {
  text: string;
  onRecordingComplete: (transcript: string, audioUrl: string) => void;
}

export function SpeechComponent({ text, onRecordingComplete }: SpeechComponentProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      stopMediaTracks();
    };
  }, []);

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    audioChunksRef.current = [];
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.start(100);
        
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunksRef.current.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          processRecording();
        });

        setIsRecording(true);

        setTimeout(() => {
          stopRecording();
        }, 30000);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setIsRecording(false);
      });
  };

  const processRecording = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onRecordingComplete(transcript, audioUrl);
    };
    recognition.start();
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }

    audioChunksRef.current = [];
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


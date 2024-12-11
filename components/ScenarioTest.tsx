'use client'

import React, { useState } from 'react';
import Button from "@/components/ui/Button"
import { DialogueSimulation } from './DialogueSimulation'
import { SpeechToText } from './SpeechToText'
import { DialogueStep } from '../data/scenarios'

interface ScenarioTestProps {
  dialogue: DialogueStep[];
  scenario: string;
  onComplete: () => void;
}

export function ScenarioTest({ dialogue, scenario, onComplete }: ScenarioTestProps) {
  const [showSpeechTest, setShowSpeechTest] = useState(false);

  if (showSpeechTest) {
    return <SpeechToText onBack={() => setShowSpeechTest(false)} />;
  }

  return (
    <div className="space-y-4">
      <DialogueSimulation
        scenario={scenario}
        onComplete={onComplete}
      />
      <div className="flex justify-center">
        <Button onClick={() => setShowSpeechTest(true)}>
          语音转文字测试
        </Button>
      </div>
    </div>
  );
}

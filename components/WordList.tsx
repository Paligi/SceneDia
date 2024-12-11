'use client'

import { useState } from 'react';
import { Word } from '../data/scenarios';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from "@/components/ui/Button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface WordListProps {
  words: Word[];
}

export function WordList({ words }: WordListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">单词列表</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1"
        >
          {isExpanded ? (
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
      
      {isExpanded && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>单词</TableHead>
              <TableHead>翻译</TableHead>
              <TableHead>发音</TableHead>
              <TableHead>例句</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((word, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{word.word}</TableCell>
                <TableCell>{word.translation}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{word.pronunciation || '-'}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => speak(word.word)}
                      className="p-0 h-6 w-6"
                    >
                      🔊
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">{word.example}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}


'use client';

import { Button } from '@/components/ui/button';

const suggestions = [
  'Send my top 20% donors a message',
  'Create a task for a video share request',
  'Give me an extensive report of my usage this month',
  'What is my top-performing Video Share?',
  'What Message generated the most responses?',
  'What is my average bulk messaging cadence?',
];

export function PromptSuggestions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          className="h-auto min-h-[44px] px-4 py-2 justify-start text-left whitespace-normal"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
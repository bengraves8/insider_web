'use client';

import { useState } from 'react';
import { 
  ChevronRight, 
  Users, 
  MessageSquare, 
  Brain,
  ChevronDown,
  X,
  Filter,
  Database,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ResponseDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    content: string;
    messagePreview?: {
      subject?: string;
      content: string;
      recipients: string;
      messageType?: 'sms' | 'imessage' | 'email' | 'webchat';
    };
    logic?: {
      recipients?: {
        total: number;
        segments: Array<{
          name: string;
          count: number;
          criteria: string[];
        }>;
      };
      reasoning?: string[];
      dataPoints?: Array<{
        source: string;
        value: string;
      }>;
      steps?: string[];
    };
  };
}

export function ResponseDetailsPanel({ isOpen, onClose, message }: ResponseDetailsPanelProps) {
  const [activeSection, setActiveSection] = useState<string>('recipients');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'recipients',
      label: 'Recipients',
      icon: Users,
      content: message.logic?.recipients && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Recipients</span>
            <Badge variant="secondary">{message.logic.recipients.total}</Badge>
          </div>
          <div className="space-y-2">
            {message.logic.recipients.segments.map((segment, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-lg">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    <span>{segment.name}</span>
                  </div>
                  <Badge>{segment.count}</Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-8 pr-4 py-2 space-y-2">
                  {segment.criteria.map((criterion, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Filter className="w-3 h-3" />
                      {criterion}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'reasoning',
      label: 'AI Reasoning',
      icon: Brain,
      content: message.logic?.reasoning && (
        <div className="space-y-4">
          {message.logic.reasoning.map((reason, index) => (
            <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-accent/50">
              <Sparkles className="w-4 h-4 mt-1 shrink-0" />
              <p className="text-sm">{reason}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'data',
      label: 'Data Points',
      icon: Database,
      content: message.logic?.dataPoints && (
        <div className="space-y-2">
          {message.logic.dataPoints.map((point, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
              <span className="text-sm font-medium">{point.source}</span>
              <span className="text-sm text-muted-foreground">{point.value}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'steps',
      label: 'Process Steps',
      icon: MessageSquare,
      content: message.logic?.steps && (
        <div className="space-y-2">
          {message.logic.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2 p-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {index + 1}
              </div>
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="fixed right-0 top-14 bottom-0 w-[400px] bg-card border-l shadow-lg animate-in slide-in-from-right">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Response Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="border-b">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {message.messagePreview?.messageType && (
                <Badge>
                  {message.messagePreview.messageType.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {message.content}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-1 p-2 bg-muted">
            {sections.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeSection === id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveSection(id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[calc(100%-50px)]">
            <div className="p-4">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
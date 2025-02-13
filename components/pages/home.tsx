'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, RefreshCw, X, ChevronDown } from 'lucide-react';
import { PromptSuggestions } from '@/components/features/PromptSuggestions';
import { ChatInput } from '@/components/features/ChatInput';
import { Button } from '@/components/ui/button';
import { ResponseDetailsPanel } from '@/components/features/ResponseDetailsPanel';
import { Badge } from '@/components/ui/badge';
import { UsageReport } from '@/components/features/UsageReport';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources: string[];
  messagePreview?: {
    subject: string;
    content: string;
    recipients: string;
    messageType?: 'sms' | 'imessage' | 'email' | 'webchat' | 'newsletter';
  };
  file?: {
    name: string;
    size: number;
    type: string;
    url: string;
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
    suggestions?: Array<{
      subject: string;
      content: string;
      type: string;
    }>;
  };
  showUsageReport?: boolean;
}

export function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const conversationStart = new Date();

  const handleSend = (content: string, sources: string[], file?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      sources,
      file: file ? {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      } : undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
    simulateResponse(content);
  };

  const simulateResponse = (prompt: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      let aiResponse: Message;

      if (prompt.toLowerCase().includes('usage') || prompt.toLowerCase().includes('report')) {
        aiResponse = {
          id: Date.now().toString(),
          content: "I've analyzed your usage data and prepared a comprehensive report. Here's a detailed breakdown of your messaging and engagement metrics:",
          sender: 'assistant',
          timestamp: new Date(),
          sources: ['insider'],
          showUsageReport: true,
          logic: {
            steps: [
              'Collected data from multiple sources',
              'Analyzed engagement patterns',
              'Generated insights',
              'Compiled metrics'
            ],
            dataPoints: [
              { source: 'Message Delivery', value: '98.5% success rate' },
              { source: 'Engagement', value: '32.4% click rate' },
              { source: 'Response Rate', value: '76% average' }
            ]
          }
        };
      } else {
        aiResponse = {
          id: Date.now().toString(),
          content: "I understand your request. How would you like to proceed with this?",
          sender: 'assistant',
          timestamp: new Date(),
          sources: ['insider']
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 1500);
  };

  const handlePromptSelect = (prompt: string) => {
    handleSend(prompt, ['insider']);
  };

  const handleShowDetails = (message: Message) => {
    setSelectedMessage(message);
    setShowDetails(true);
  };

  const renderMessageContent = (message: Message) => {
    if (message.showUsageReport) {
      return (
        <div className="space-y-4">
          <div>{message.content}</div>
          <div className="mt-4">
            <UsageReport />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div>{message.content}</div>
        {message.file && (
          <div className="mt-2 text-sm text-muted-foreground">
            📎 {message.file.name} ({(message.file.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 messages-container relative">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <img 
                  src="https://app.stakd.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstacked-messenger.appspot.com%2F64385c08dd77ed2330fab5fd%2Fmedia%2Fuploads%2F6798028fb3efae235a0cb1a1.png&w=2048&q=75" 
                  alt="Logo" 
                  className="w-32 h-32" 
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Welcome to Stakd Assistant</h2>
              <p className="text-muted-foreground mb-6">
                Start by selecting a prompt or typing your questions below.
              </p>
              <PromptSuggestions onSelect={handlePromptSelect} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <span className="inline-block px-3 py-1 text-sm text-muted-foreground bg-muted rounded-full">
                  {format(conversationStart, 'MMMM d, yyyy • h:mm a')}
                </span>
              </div>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } group`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 animate-pulse" />
                      <span>Generating message...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {showScrollButton && (
            <Button
              className="fixed bottom-20 right-8 rounded-full shadow-lg"
              size="icon"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ChatInput onSend={handleSend} />

      {selectedMessage && (
        <ResponseDetailsPanel
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          message={selectedMessage}
        />
      )}
    </div>
  );
}
'use client';

import { Mail, MessageSquare } from 'lucide-react';

type MessageType = 'email' | 'text' | 'imessage' | 'webchat' | 'newsletter';

interface MessageTypeIconProps {
  type: MessageType;
  className?: string;
}

export function MessageTypeIcon({ type, className = "w-4 h-4" }: MessageTypeIconProps) {
  switch (type) {
    case 'email':
    case 'newsletter':
      return <Mail className={className} />;
    case 'text':
    case 'imessage':
    case 'webchat':
      return <MessageSquare className={className} />;
  }
}
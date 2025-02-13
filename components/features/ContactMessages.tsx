'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, ExternalLink, Pencil, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageTypeIcon } from '@/components/shared/MessageTypeIcon';
import { MediaPreview } from '@/components/shared/MediaPreview';
import { MessageMetadata } from '@/components/shared/MessageMetadata';
import { AttachedMedia } from '@/components/shared/AttachedMedia';
import { EditableSection } from '@/components/shared/EditableSection';

interface Message {
  id: string;
  type: 'email' | 'text' | 'imessage' | 'webchat' | 'newsletter';
  direction: 'sent' | 'received';
  subject?: string;
  content: string;
  timestamp: string;
  media?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    name: string;
    size: number;
    url: string;
  }>;
  metadata?: {
    delivered: boolean;
    read?: boolean;
    clicked?: boolean;
    openRate?: number;
    clickRate?: number;
  };
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    type: 'email',
    direction: 'sent',
    subject: 'Follow-up from our meeting',
    content: "Thank you for taking the time to meet with us yesterday. I've attached the presentation we discussed.",
    timestamp: '2024-03-20T14:30:00Z',
    media: [
      {
        id: 'file-1',
        type: 'document',
        name: 'Presentation.pdf',
        size: 2500000,
        url: '#'
      }
    ],
    metadata: {
      delivered: true,
      read: true,
      clicked: true,
      openRate: 100,
      clickRate: 75
    }
  },
  {
    id: 'msg-2',
    type: 'imessage',
    direction: 'received',
    content: "Got it, thanks! The presentation looks great. I'll share it with the team.",
    timestamp: '2024-03-20T14:45:00Z',
    metadata: {
      delivered: true,
      read: true
    }
  },
  {
    id: 'msg-3',
    type: 'newsletter',
    direction: 'sent',
    subject: 'March Product Updates',
    content: 'Check out our latest product updates and new features launching this month!',
    timestamp: '2024-03-15T10:00:00Z',
    media: [
      {
        id: 'img-1',
        type: 'image',
        name: 'header.jpg',
        size: 500000,
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
      }
    ],
    metadata: {
      delivered: true,
      openRate: 85,
      clickRate: 42
    }
  }
];

const getMessageTypeColor = (type: Message['type']) => {
  switch (type) {
    case 'email':
      return 'bg-blue-100 text-blue-800';
    case 'newsletter':
      return 'bg-purple-100 text-purple-800';
    case 'text':
      return 'bg-green-100 text-green-800';
    case 'imessage':
      return 'bg-blue-100 text-blue-800';
    case 'webchat':
      return 'bg-yellow-100 text-yellow-800';
  }
};

interface ContactMessagesProps {
  contactId: string;
}

interface MessageEditFormProps {
  message: Message;
  onSave: (updatedMessage: Message) => void;
  onCancel: () => void;
}

function MessageEditForm({ message, onSave, onCancel }: MessageEditFormProps) {
  const [editedMessage, setEditedMessage] = useState(message);

  return (
    <div className="space-y-4">
      {(message.type === 'email' || message.type === 'newsletter') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Input
            value={editedMessage.subject}
            onChange={(e) => setEditedMessage({ ...editedMessage, subject: e.target.value })}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={editedMessage.content}
          onChange={(e) => setEditedMessage({ ...editedMessage, content: e.target.value })}
          rows={5}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(editedMessage)}>Save Changes</Button>
      </div>
    </div>
  );
}

export function ContactMessages({ contactId }: ContactMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedMedia, setSelectedMedia] = useState<Message['media'][0] | null>(null);
  const [filter, setFilter] = useState('all');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const handleMessageSave = (messageId: string, updatedMessage: Message) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? updatedMessage : msg
    ));
    setEditingMessageId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Messages</h2>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="imessage">iMessage</SelectItem>
              <SelectItem value="webchat">Webchat</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {messages
          .filter(msg => filter === 'all' || msg.type === filter)
          .map((message) => (
            <div
              key={message.id}
              className={`p-4 border rounded-lg space-y-3 ${
                message.direction === 'received' ? 'bg-muted/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getMessageTypeColor(message.type)}>
                    <span className="flex items-center gap-1">
                      <MessageTypeIcon type={message.type} />
                      {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                    </span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(message.timestamp), 'MMM d, yyyy • h:mm a')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {message.direction === 'sent' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMessageId(message.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {editingMessageId === message.id ? (
                <MessageEditForm
                  message={message}
                  onSave={(updatedMessage) => handleMessageSave(message.id, updatedMessage)}
                  onCancel={() => setEditingMessageId(null)}
                />
              ) : (
                <>
                  {message.subject && (
                    <div className="font-medium">{message.subject}</div>
                  )}

                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                  {message.media && (
                    <AttachedMedia 
                      media={message.media} 
                      onPreview={setSelectedMedia} 
                    />
                  )}

                  {message.metadata && (message.type === 'email' || message.type === 'newsletter') && (
                    <MessageMetadata 
                      type={message.type} 
                      metadata={message.metadata} 
                    />
                  )}
                </>
              )}
            </div>
          ))}
      </div>

      <MediaPreview 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </div>
  );
}
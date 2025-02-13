'use client';

import { useState } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  Calendar,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SharedMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  name: string;
  sharedVia: 'email' | 'sms' | 'imessage' | 'webchat';
  messageType: 'newsletter' | 'direct' | 'broadcast' | 'automated';
  sharedAt: string;
  sharedBy: {
    name: string;
    avatar: string;
  };
  messageId: string;
}

const MOCK_SHARED_MEDIA: SharedMedia[] = [
  {
    id: 'media-1',
    type: 'video',
    url: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516245834210-c4c142787335',
    name: 'Campaign Video Update',
    sharedVia: 'email',
    messageType: 'newsletter',
    sharedAt: '2024-03-20T14:30:00Z',
    sharedBy: {
      name: 'Alice Smith',
      avatar: 'https://picsum.photos/seed/user1/32/32'
    },
    messageId: 'msg-1'
  },
  {
    id: 'media-2',
    type: 'image',
    url: 'https://example.com/image1.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
    name: 'Event Photos',
    sharedVia: 'sms',
    messageType: 'direct',
    sharedAt: '2024-03-18T10:00:00Z',
    sharedBy: {
      name: 'Bob Johnson',
      avatar: 'https://picsum.photos/seed/user2/32/32'
    },
    messageId: 'msg-2'
  }
];

const getMediaIcon = (type: SharedMedia['type']) => {
  switch (type) {
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
  }
};

const getMessageTypeColor = (type: SharedMedia['messageType']) => {
  switch (type) {
    case 'newsletter':
      return 'bg-blue-100 text-blue-800';
    case 'direct':
      return 'bg-green-100 text-green-800';
    case 'broadcast':
      return 'bg-purple-100 text-purple-800';
    case 'automated':
      return 'bg-orange-100 text-orange-800';
  }
};

const getSharedViaIcon = (via: SharedMedia['sharedVia']) => {
  switch (via) {
    case 'email':
      return <Mail className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

interface ContactSharedMediaProps {
  contactId: string;
}

export function ContactSharedMedia({ contactId }: ContactSharedMediaProps) {
  const [media] = useState<SharedMedia[]>(MOCK_SHARED_MEDIA);
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Shared Media</h2>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Media</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {media
          .filter(item => filter === 'all' || item.type === filter)
          .map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/75 text-white">
                    {item.type === 'video' ? 'Video' : 'Image'}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(item.sharedAt), 'MMM d, yyyy • h:mm a')}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSharedViaIcon(item.sharedVia)}
                    <span className="text-sm capitalize">{item.sharedVia}</span>
                  </div>
                  <Badge variant="secondary" className={getMessageTypeColor(item.messageType)}>
                    {item.messageType}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.sharedBy.avatar}
                      alt={item.sharedBy.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm">{item.sharedBy.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/messages/${item.messageId}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Message
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
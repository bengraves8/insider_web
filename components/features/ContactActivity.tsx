'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, MessageSquare, FileText, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'email',
    title: 'Email sent',
    description: 'Sent follow-up regarding project timeline',
    timestamp: '2 hours ago',
    user: {
      id: 'user-1',
      name: 'Alice Smith',
      avatar: 'https://picsum.photos/seed/user1/32/32'
    }
  },
  {
    id: '2',
    type: 'call',
    title: 'Phone call',
    description: 'Discussed contract terms',
    timestamp: 'Yesterday',
    user: {
      id: 'user-2',
      name: 'Bob Johnson',
      avatar: 'https://picsum.photos/seed/user2/32/32'
    }
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Meeting scheduled',
    description: 'Quarterly review meeting',
    timestamp: '3 days ago',
    user: {
      id: 'user-3',
      name: 'Carol Williams',
      avatar: 'https://picsum.photos/seed/user3/32/32'
    }
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'email':
      return <Mail className="w-4 h-4" />;
    case 'call':
      return <Phone className="w-4 h-4" />;
    case 'meeting':
      return <Calendar className="w-4 h-4" />;
    case 'note':
      return <MessageSquare className="w-4 h-4" />;
    case 'task':
      return <FileText className="w-4 h-4" />;
  }
};

interface ContactActivityProps {
  contactId: string;
}

export function ContactActivity({ contactId }: ContactActivityProps) {
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4 p-4 border rounded-lg">
          <Avatar>
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  {getActivityIcon(activity.type)}
                  <span>{activity.title}</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {activity.timestamp}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';

import { useState } from 'react';
import {
  BarChart,
  Users,
  MessageSquare,
  Video,
  TrendingUp,
  Mail,
  MousePointer,
  UserMinus,
  Filter
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface UsageStats {
  totalMessages: number;
  totalContacts: number;
  engagedContacts: number;
  totalResponses: number;
  bestVideo: {
    title: string;
    views: number;
    engagement: number;
  };
  bestMessage: {
    subject: string;
    openRate: number;
    clickRate: number;
  };
  deliveryRate: number;
  clickRate: number;
  optOuts: number;
}

const MOCK_MONTHLY_STATS: Record<string, UsageStats> = {
  'current': {
    totalMessages: 1250,
    totalContacts: 5000,
    engagedContacts: 3750,
    totalResponses: 950,
    bestVideo: {
      title: 'Product Launch 2024',
      views: 2800,
      engagement: 85
    },
    bestMessage: {
      subject: 'Special Spring Announcement',
      openRate: 78,
      clickRate: 45
    },
    deliveryRate: 98.5,
    clickRate: 32.4,
    optOuts: 15
  },
  'last-month': {
    totalMessages: 1100,
    totalContacts: 4800,
    engagedContacts: 3500,
    totalResponses: 850,
    bestVideo: {
      title: 'Team Update February',
      views: 2500,
      engagement: 82
    },
    bestMessage: {
      subject: 'Winter Newsletter',
      openRate: 75,
      clickRate: 42
    },
    deliveryRate: 98.2,
    clickRate: 30.8,
    optOuts: 12
  },
  'last-quarter': {
    totalMessages: 3200,
    totalContacts: 4500,
    engagedContacts: 3200,
    totalResponses: 2400,
    bestVideo: {
      title: 'Year in Review 2023',
      views: 3200,
      engagement: 88
    },
    bestMessage: {
      subject: 'Holiday Special Announcement',
      openRate: 82,
      clickRate: 48
    },
    deliveryRate: 99.1,
    clickRate: 35.2,
    optOuts: 28
  }
};

export function UsageReport() {
  const [timeframe, setTimeframe] = useState('current');
  const stats = MOCK_MONTHLY_STATS[timeframe];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Usage Report</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of your messaging and engagement metrics
          </p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Messages and Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Messages & Contacts
            </CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total messages sent</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{stats.totalContacts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total contacts</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{stats.engagedContacts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Engaged contacts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Performing Video */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Best Performing Video
            </CardTitle>
            <Video className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-lg font-medium line-clamp-1">{stats.bestVideo.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {stats.bestVideo.engagement}% engagement
                  </Badge>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total views</span>
                  <span className="font-medium">{stats.bestVideo.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Engaged Message */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Most Engaged Message
            </CardTitle>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-lg font-medium line-clamp-1">{stats.bestMessage.subject}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {stats.bestMessage.openRate}% open rate
                  </Badge>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Click rate</span>
                  <span className="font-medium">{stats.bestMessage.clickRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Delivery Metrics
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
                  <p className="text-xs text-muted-foreground">Average delivery rate</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{stats.clickRate}%</div>
                  <p className="text-xs text-muted-foreground">Average click rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Response Statistics
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{stats.totalResponses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total responses received</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Response rate</span>
                <span className="font-medium">
                  {((stats.totalResponses / stats.totalMessages) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opt-outs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Opt-outs
            </CardTitle>
            <UserMinus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{stats.optOuts}</div>
                <p className="text-xs text-muted-foreground">Total opt-outs</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Opt-out rate</span>
                <span className="font-medium">
                  {((stats.optOuts / stats.totalContacts) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground mt-8">
        <p>Data sources:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Message delivery and engagement metrics from Email Service Provider</li>
          <li>Contact information and activity from CRM database</li>
          <li>Video analytics from Video Hosting Platform</li>
          <li>Response data aggregated from all communication channels</li>
        </ul>
      </div>
    </div>
  );
}
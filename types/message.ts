import { User } from './user';
import { Organization } from './org';
import { Media } from './media';

export type MessagePlatform = 
  | 'twitter' 
  | 'stacked-sms' 
  | 'email' 
  | 'personal-sms' 
  | 'web-chat';

export type MessageBodyType = 'text' | 'html';

export type MessageStatus =
  | 'draft'
  | 'building'
  | 'dispatched'
  | 'scheduled'
  | 'in-progress'
  | 'pending'
  | 'ready'
  | 'sending'
  | 'completed'
  | 'sent'
  | 'failed'
  | 'cancelled'
  | 'error';

export interface MessageBody {
  type: MessageBodyType;
  value: string;
  subject?: string;
}

export interface MessageStats {
  ready: number;
  pending: number;
  sent: number;
  error: number;
  failed: number;
  cancelled: number;
  total: number;
}

export interface MessageRecipientsList {
  contactIds?: string[];
  boardIds?: string[];
}

export type MessageBirthdayFrequency = 
  | 'birthday-daily' 
  | 'birthday-weekly' 
  | 'birthday-monthly';

export interface MessageAttachment {
  id: string;
  type: 'media' | 'placeholder';
  media?: Media;
  preview?: Media[];
}

export interface Message {
  id: string;
  orgId: string;
  title?: string;
  subject?: string;
  status: MessageStatus;
  authorId: string;
  senderId: string;
  recipients: MessageRecipientsList;
  body: MessageBody | null;
  platform: MessagePlatform;
  attachment?: MessageAttachment;
  sendAt?: number | MessageBirthdayFrequency;
  createdAt: number;
  updatedAt?: number;
  archived: boolean;
  stats?: MessageStats;
  errorMessage?: string;
  emailOpen?: number;
  emailLinkClick?: number;
  metadata?: {
    delivered: boolean;
    read?: boolean;
    clicked?: boolean;
    openRate?: number;
    clickRate?: number;
  };
}

export interface MessageWithRelations extends Message {
  author: User;
  sender: User;
  organization: Organization;
}

export interface MessageUpdateParams {
  title?: string;
  senderId?: string;
  recipients?: MessageRecipientsList;
  body?: MessageBody;
  platform?: MessagePlatform;
  attachment?: MessageAttachment;
  sendAt?: number | MessageBirthdayFrequency;
}

export interface MessageRecipient {
  id: string;
  orgId: string;
  messageId: string;
  status: MessageStatus;
  body: MessageBody | null;
  senderId: string;
  recipientId: string;
  platform: MessagePlatform;
  channel: string;
  sendAt?: number;
  createdAt: number;
  updatedAt?: number;
  sentAt?: number;
  statusMessage?: string;
  openCount?: number;
  clickCount?: number;
}
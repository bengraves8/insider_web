import { MediaType } from './media';
import { MessagePlatform } from './message';

export interface ContactBase {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  status: 'active' | 'archived';
  tags: string[];
  notes?: string;
  lastContacted?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ContactActivity {
  id: string;
  contactId: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
}

export interface ContactTask {
  id: string;
  contactId: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  assigneeId: string;
}

export interface ContactMessage {
  id: string;
  contactId: string;
  type: MessagePlatform;
  direction: 'sent' | 'received';
  subject?: string;
  content: string;
  timestamp: string;
  media?: Array<{
    id: string;
    type: MediaType;
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

export interface ContactNote {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  userId: string;
}

export interface ContactTransaction {
  id: string;
  contactId: string;
  name: string;
  amount: number;
  status: string;
  probability: number;
}

export interface ContactStats {
  totalTransactions: number;
  totalDonations: number;
  averageResponseTime: string;
  lastActivity: string;
}

export interface Contact extends ContactBase {
  activities?: ContactActivity[];
  tasks?: ContactTask[];
  messages?: ContactMessage[];
  notes?: ContactNote[];
  transactions?: ContactTransaction[];
  stats?: ContactStats;
}

export type CreateContactInput = Omit<ContactBase, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateContactInput = Partial<Omit<ContactBase, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>>;
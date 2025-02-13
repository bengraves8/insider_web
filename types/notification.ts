export type NotificationType = 
  | 'chat-inbound'
  | 'video-share-request'
  | 'system'
  | 'error'
  | 'message-sent'
  | 'message-failed'
  | 'contact-updated';

export interface NotificationBase {
  id: string;
  orgId: string;
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
}

export interface ChatNotification extends NotificationBase {
  type: 'chat-inbound';
  data: {
    platform: string;
    body: string | null;
    media: string[] | null;
    contactId?: string;
  };
}

export interface VideoShareRequestNotification extends NotificationBase {
  type: 'video-share-request';
  data: {
    taskId: string;
    taskName: string;
    requesterId: string;
  };
}

export interface MessageNotification extends NotificationBase {
  type: 'message-sent' | 'message-failed';
  data: {
    messageId: string;
    recipientCount: number;
    platform: string;
    error?: string;
  };
}

export interface ContactNotification extends NotificationBase {
  type: 'contact-updated';
  data: {
    contactId: string;
    changes: string[];
    updatedBy: string;
  };
}

export interface SystemNotification extends NotificationBase {
  type: 'system';
  data: Record<string, unknown>;
}

export interface ErrorNotification extends NotificationBase {
  type: 'error';
  data: {
    code: string;
    details?: unknown;
  };
}

export type Notification = 
  | ChatNotification 
  | VideoShareRequestNotification 
  | MessageNotification
  | ContactNotification
  | SystemNotification 
  | ErrorNotification;

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    [K in NotificationType]: {
      enabled: boolean;
      priority: 'low' | 'medium' | 'high';
    };
  };
}

export interface NotificationFilter {
  type?: NotificationType[];
  read?: boolean;
  priority?: ('low' | 'medium' | 'high')[];
  startDate?: number;
  endDate?: number;
}
export interface AIConversation {
  id: string;
  name: string;
  userId: string;
  orgId: string;
  createdAt: number;
  updatedAt?: number;
}

export interface AIConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: number;
  userId: string;
  orgId: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  providerId: string;
}
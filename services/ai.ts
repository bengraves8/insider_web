import { apiRequest } from './api';
import { AIConversation, AIConversationMessage } from '@/types';

export const aiApi = {
  getConversations: async () => {
    return apiRequest<AIConversation[]>({
      url: '/ai/conversations',
      method: 'GET',
    });
  },

  getConversation: async (conversationId: string) => {
    return apiRequest<AIConversation>({
      url: `/ai/conversations/${conversationId}`,
      method: 'GET',
    });
  },

  createConversation: async (name: string) => {
    return apiRequest<AIConversation>({
      url: '/ai/conversations',
      method: 'POST',
      data: { name },
    });
  },

  getMessages: async (conversationId: string) => {
    return apiRequest<AIConversationMessage[]>({
      url: `/ai/conversations/${conversationId}/messages`,
      method: 'GET',
    });
  },

  sendMessage: async (conversationId: string, content: string) => {
    return apiRequest<AIConversationMessage[]>({
      url: `/ai/conversations/${conversationId}/messages`,
      method: 'POST',
      data: { content },
    });
  },
};
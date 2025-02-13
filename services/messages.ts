'use client';

import { apiRequest } from './api';
import { 
  Message, 
  MessageUpdateParams,
  MessageRecipient,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const messagesApi = {
  getMessages: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Message>>({
      url: '/messages',
      method: 'GET',
      params,
    });
  },

  getMessage: async (id: string) => {
    return apiRequest<Message>({
      url: `/messages/${id}`,
      method: 'GET',
    });
  },

  createMessage: async (data: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiRequest<Message>({
      url: '/messages',
      method: 'POST',
      data,
    });
  },

  updateMessage: async (id: string, data: MessageUpdateParams) => {
    return apiRequest<Message>({
      url: `/messages/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteMessage: async (id: string) => {
    return apiRequest<void>({
      url: `/messages/${id}`,
      method: 'DELETE',
    });
  },

  getMessageRecipients: async (id: string) => {
    return apiRequest<MessageRecipient[]>({
      url: `/messages/${id}/recipients`,
      method: 'GET',
    });
  },

  markAsRead: async (id: string) => {
    return apiRequest<void>({
      url: `/messages/${id}/read`,
      method: 'PUT',
    });
  },

  markAsUnread: async (id: string) => {
    return apiRequest<void>({
      url: `/messages/${id}/unread`,
      method: 'PUT',
    });
  },

  archive: async (id: string) => {
    return apiRequest<void>({
      url: `/messages/${id}/archive`,
      method: 'PUT',
    });
  },

  unarchive: async (id: string) => {
    return apiRequest<void>({
      url: `/messages/${id}/unarchive`,
      method: 'PUT',
    });
  },
};
import { apiRequest } from './api';
import { 
  Notification,
  NotificationPreferences,
  NotificationFilter,
  PaginatedResponse 
} from '@/types';

export const notificationsApi = {
  getNotifications: async (params?: NotificationFilter & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Notification>>({
      url: '/notifications',
      method: 'GET',
      params,
    });
  },

  markAsRead: async (id: string) => {
    return apiRequest<void>({
      url: `/notifications/${id}/read`,
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiRequest<void>({
      url: '/notifications/read-all',
      method: 'PUT',
    });
  },

  getPreferences: async () => {
    return apiRequest<NotificationPreferences>({
      url: '/notifications/preferences',
      method: 'GET',
    });
  },

  updatePreferences: async (preferences: Partial<NotificationPreferences>) => {
    return apiRequest<NotificationPreferences>({
      url: '/notifications/preferences',
      method: 'PUT',
      data: preferences,
    });
  },
};
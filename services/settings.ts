import { apiRequest } from './api';
import { APIKey } from '@/types';

export const settingsApi = {
  getApiKeys: async () => {
    return apiRequest<APIKey>({
      url: '/settings/api',
      method: 'GET',
    });
  },

  createApiKey: async (name: string) => {
    return apiRequest<APIKey>({
      url: '/settings/api',
      method: 'POST',
      data: { name },
    });
  },

  deleteApiKey: async (id: string) => {
    return apiRequest<void>({
      url: `/settings/api/${id}`,
      method: 'DELETE',
    });
  },
};
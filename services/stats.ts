import { apiRequest } from './api';
import { UsageStats } from '@/types';

export const statsApi = {
  getUsageStats: async (params?: { startDate?: string; endDate?: string }) => {
    return apiRequest<UsageStats>({
      url: '/stats/usage',
      method: 'GET',
      params,
    });
  },

  getPlatformStats: async (platform: string, params?: { startDate?: string; endDate?: string }) => {
    return apiRequest<UsageStats>({
      url: `/stats/platform/${platform}`,
      method: 'GET',
      params,
    });
  },
};
import { apiRequest } from './api';
import { 
  Share, 
  ShareVideo, 
  ShareContactForm,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const sharesApi = {
  getShares: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Share>>({
      url: '/shares',
      method: 'GET',
      params,
    });
  },

  getShare: async (id: string) => {
    return apiRequest<Share>({
      url: `/shares/${id}`,
      method: 'GET',
    });
  },

  createVideoShare: async (data: Omit<ShareVideo, 'id' | 'createdAt'>) => {
    return apiRequest<ShareVideo>({
      url: '/shares/video',
      method: 'POST',
      data,
    });
  },

  createContactFormShare: async (data: Omit<ShareContactForm, 'id' | 'createdAt'>) => {
    return apiRequest<ShareContactForm>({
      url: '/shares/contact-form',
      method: 'POST',
      data,
    });
  },

  updateShare: async (id: string, data: Partial<Share>) => {
    return apiRequest<Share>({
      url: `/shares/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteShare: async (id: string) => {
    return apiRequest<void>({
      url: `/shares/${id}`,
      method: 'DELETE',
    });
  },

  getShareStats: async (id: string) => {
    return apiRequest<{
      views: number;
      submissions?: number;
      ctaClicks?: number;
    }>({
      url: `/shares/${id}/stats`,
      method: 'GET',
    });
  },
};
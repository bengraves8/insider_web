import { apiRequest } from './api';
import { 
  Media, 
  MediaUploadParams,
  MediaUpdateParams,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const mediaApi = {
  getMedia: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Media>>({
      url: '/media',
      method: 'GET',
      params,
    });
  },

  getMediaItem: async (id: string) => {
    return apiRequest<Media>({
      url: `/media/${id}`,
      method: 'GET',
    });
  },

  uploadMedia: async (data: MediaUploadParams) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('name', data.name);
    formData.append('type', data.type);
    if (data.userId) formData.append('userId', data.userId);
    if (data.contactId) formData.append('contactId', data.contactId);

    return apiRequest<Media>({
      url: '/media/upload',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateMedia: async (id: string, data: MediaUpdateParams) => {
    return apiRequest<Media>({
      url: `/media/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteMedia: async (id: string) => {
    return apiRequest<void>({
      url: `/media/${id}`,
      method: 'DELETE',
    });
  },
};
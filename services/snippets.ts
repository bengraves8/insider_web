import { apiRequest } from './api';
import { 
  Snippet, 
  CreateSnippetParams, 
  UpdateSnippetParams,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const snippetsApi = {
  getSnippets: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Snippet>>({
      url: '/snippets',
      method: 'GET',
      params,
    });
  },

  getSnippet: async (id: string) => {
    return apiRequest<Snippet>({
      url: `/snippets/${id}`,
      method: 'GET',
    });
  },

  createSnippet: async (data: CreateSnippetParams) => {
    return apiRequest<Snippet>({
      url: '/snippets',
      method: 'POST',
      data,
    });
  },

  updateSnippet: async (id: string, data: UpdateSnippetParams) => {
    return apiRequest<Snippet>({
      url: `/snippets/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteSnippet: async (id: string) => {
    return apiRequest<void>({
      url: `/snippets/${id}`,
      method: 'DELETE',
    });
  },
};
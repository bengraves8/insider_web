import { apiRequest } from './api';
import { 
  User,
  CreateUserParams,
  UpdateUserParams,
  UserMessageStats,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const usersApi = {
  getUsers: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<User>>({
      url: '/users',
      method: 'GET',
      params,
    });
  },

  getUser: async (id: string) => {
    return apiRequest<User>({
      url: `/users/${id}`,
      method: 'GET',
    });
  },

  createUser: async (data: CreateUserParams) => {
    return apiRequest<User>({
      url: '/users',
      method: 'POST',
      data,
    });
  },

  updateUser: async (id: string, data: UpdateUserParams) => {
    return apiRequest<User>({
      url: `/users/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteUser: async (id: string) => {
    return apiRequest<void>({
      url: `/users/${id}`,
      method: 'DELETE',
    });
  },

  getUserMessageStats: async (id: string) => {
    return apiRequest<UserMessageStats>({
      url: `/users/${id}/message-stats`,
      method: 'GET',
    });
  },
};
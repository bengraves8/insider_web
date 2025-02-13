import { apiRequest } from './api';
import { 
  User, 
  Organization,
  Contact,
  Message,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const adminApi = {
  // Organization Management
  getOrgs: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Organization>>({
      url: '/admin/orgs',
      method: 'GET',
      params,
    });
  },

  getOrgUsers: async (orgId: string, params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<User>>({
      url: `/admin/orgs/${orgId}/users`,
      method: 'GET',
      params,
    });
  },

  getOrgContacts: async (orgId: string, params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Contact>>({
      url: `/admin/orgs/${orgId}/contacts`,
      method: 'GET',
      params,
    });
  },

  getOrgMessages: async (orgId: string, params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Message>>({
      url: `/admin/orgs/${orgId}/messages`,
      method: 'GET',
      params,
    });
  },

  updateOrgStatus: async (orgId: string, status: 'active' | 'suspended') => {
    return apiRequest<Organization>({
      url: `/admin/orgs/${orgId}/status`,
      method: 'PUT',
      data: { status },
    });
  },

  // User Management
  updateUser: async (orgId: string, userId: string, data: Partial<User>) => {
    return apiRequest<User>({
      url: `/admin/orgs/${orgId}/users/${userId}`,
      method: 'PUT',
      data,
    });
  },

  deleteUser: async (orgId: string, userId: string) => {
    return apiRequest<void>({
      url: `/admin/orgs/${orgId}/users/${userId}`,
      method: 'DELETE',
    });
  },
};
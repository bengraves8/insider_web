import { apiRequest } from './api';
import { 
  Contact, 
  CreateContactInput, 
  UpdateContactInput,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const contactsApi = {
  getContacts: async (params?: FilterParams & { page?: number; limit?: number }) => {
    return apiRequest<PaginatedResponse<Contact>>({
      url: '/contacts',
      method: 'GET',
      params,
    });
  },

  getContact: async (id: string) => {
    return apiRequest<Contact>({
      url: `/contacts/${id}`,
      method: 'GET',
    });
  },

  createContact: async (data: CreateContactInput) => {
    return apiRequest<Contact>({
      url: '/contacts',
      method: 'POST',
      data,
    });
  },

  updateContact: async (id: string, data: UpdateContactInput) => {
    return apiRequest<Contact>({
      url: `/contacts/${id}`,
      method: 'PUT',
      data,
    });
  },

  deleteContact: async (id: string) => {
    return apiRequest<void>({
      url: `/contacts/${id}`,
      method: 'DELETE',
    });
  },

  getContactActivities: async (id: string) => {
    return apiRequest<Contact['activities']>({
      url: `/contacts/${id}/activities`,
      method: 'GET',
    });
  },

  getContactMessages: async (id: string) => {
    return apiRequest<Contact['messages']>({
      url: `/contacts/${id}/messages`,
      method: 'GET',
    });
  },
};
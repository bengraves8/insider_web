import { apiRequest } from './api';
import { 
  Organization,
  CreateOrgParams,
  UpdateOrgParams,
  WebChatConfig,
  AIAssistantConfig,
  Onboarding 
} from '@/types';

export const organizationsApi = {
  getOrganization: async (id: string) => {
    return apiRequest<Organization>({
      url: `/organizations/${id}`,
      method: 'GET',
    });
  },

  createOrganization: async (data: CreateOrgParams) => {
    return apiRequest<Organization>({
      url: '/organizations',
      method: 'POST',
      data,
    });
  },

  updateOrganization: async (id: string, data: UpdateOrgParams) => {
    return apiRequest<Organization>({
      url: `/organizations/${id}`,
      method: 'PUT',
      data,
    });
  },

  getWebChatConfig: async (id: string) => {
    return apiRequest<WebChatConfig>({
      url: `/organizations/${id}/webchat-config`,
      method: 'GET',
    });
  },

  updateWebChatConfig: async (id: string, config: Partial<WebChatConfig>) => {
    return apiRequest<WebChatConfig>({
      url: `/organizations/${id}/webchat-config`,
      method: 'PUT',
      data: config,
    });
  },

  getAIConfig: async (id: string) => {
    return apiRequest<AIAssistantConfig>({
      url: `/organizations/${id}/ai-config`,
      method: 'GET',
    });
  },

  updateAIConfig: async (id: string, config: Partial<AIAssistantConfig>) => {
    return apiRequest<AIAssistantConfig>({
      url: `/organizations/${id}/ai-config`,
      method: 'PUT',
      data: config,
    });
  },

  submitOnboarding: async (id: string, data: Omit<Onboarding, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>) => {
    return apiRequest<Onboarding>({
      url: `/organizations/${id}/onboarding`,
      method: 'POST',
      data,
    });
  },
};
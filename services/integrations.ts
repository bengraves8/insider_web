import { apiRequest } from './api';
import { 
  Integration, 
  IntegrationSyncRequest, 
  IntegrationType 
} from '@/types';

export const integrationsApi = {
  getIntegrations: async () => {
    return apiRequest<Integration[]>({
      url: '/integrations',
      method: 'GET',
    });
  },

  getIntegration: async (type: IntegrationType) => {
    return apiRequest<Integration>({
      url: `/integrations/${type}`,
      method: 'GET',
    });
  },

  connectIntegration: async (type: IntegrationType, config: Record<string, unknown>) => {
    return apiRequest<Integration>({
      url: `/integrations/${type}/connect`,
      method: 'POST',
      data: config,
    });
  },

  disconnectIntegration: async (type: IntegrationType) => {
    return apiRequest<void>({
      url: `/integrations/${type}/disconnect`,
      method: 'POST',
    });
  },

  syncIntegration: async (type: IntegrationType) => {
    return apiRequest<IntegrationSyncRequest>({
      url: `/integrations/${type}/sync`,
      method: 'POST',
    });
  },

  getSyncStatus: async (type: IntegrationType, syncId: string) => {
    return apiRequest<IntegrationSyncRequest>({
      url: `/integrations/${type}/sync/${syncId}`,
      method: 'GET',
    });
  },
};
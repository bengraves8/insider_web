import { apiRequest } from './api';
import { 
  SyncProvider, 
  SyncContactConflict,
  PaginatedResponse,
  FilterParams 
} from '@/types';

export const syncApi = {
  getSyncConflicts: async (params?: FilterParams & { 
    provider?: SyncProvider;
    page?: number; 
    limit?: number;
  }) => {
    return apiRequest<PaginatedResponse<SyncContactConflict>>({
      url: '/sync/conflicts',
      method: 'GET',
      params,
    });
  },

  resolveSyncConflict: async (id: string, resolution: {
    action: 'merge' | 'skip' | 'create';
    targetContactId?: string;
  }) => {
    return apiRequest<void>({
      url: `/sync/conflicts/${id}/resolve`,
      method: 'POST',
      data: resolution,
    });
  },

  startSync: async (provider: SyncProvider) => {
    return apiRequest<{
      syncId: string;
      status: 'started';
    }>({
      url: `/sync/${provider}/start`,
      method: 'POST',
    });
  },

  getSyncStatus: async (provider: SyncProvider, syncId: string) => {
    return apiRequest<{
      status: 'pending' | 'in-progress' | 'completed' | 'failed';
      progress?: number;
      error?: string;
    }>({
      url: `/sync/${provider}/status/${syncId}`,
      method: 'GET',
    });
  },
};
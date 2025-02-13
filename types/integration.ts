import { ObjectId } from 'mongodb';

export type IntegrationType = 'salesforce' | 'google-analytics' | 'pipedrive' | 'raisers-edge';
export type IntegrationStatus = 'active' | 'inactive' | 'error';
export type IntegrationSyncStatus = 'pending' | 'in-progress' | 'completed' | 'canceled' | 'error';

export interface Integration {
  id: string;
  orgId: string;
  type: IntegrationType;
  status: IntegrationStatus;
  createdAt: number;
  updatedAt?: number;
  config: Record<string, unknown>;
}

export interface IntegrationSyncStats {
  success: number;
  errors: number;
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  duplicates: number;
}

export interface IntegrationSyncRequest {
  id: string;
  orgId: string;
  type: IntegrationType;
  status: IntegrationSyncStatus;
  stats: IntegrationSyncStats;
  errorMessage?: string;
  createdAt: number;
  updatedAt?: number;
}
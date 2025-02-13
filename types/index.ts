import { ObjectId } from 'mongodb';

// User related types
export type UserRole = 'Admin' | 'Member' | 'Api';
export type Permission = 'admin' | 'edit' | 'view' | 'none';

export interface UserPermissions {
  events: Permission;
  contacts: Permission;
  messages: Permission;
  media: Permission;
  chat: Permission;
  analytics: Permission;
  integrations: Permission;
  subscription: Permission;
  users: Permission;
  org: Permission;
  api: Permission;
  webChat: Permission;
}

export interface User {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImg?: string;
  permissions: UserPermissions;
  createdAt: number;
  updatedAt: number;
}

// Share related types
export type ShareType = 'video' | 'contact-form';

export interface ShareBase {
  id: string;
  orgId: string;
  title: string;
  description: string;
  views: number;
  active: boolean;
  disableAds: boolean;
  createdAt: number;
  type: ShareType;
}

export interface ShareVideo extends ShareBase {
  type: 'video';
  viewsPerMessage?: Record<string, number>;
  cta?: {
    url: string;
    title: string;
  } | null;
  ctaClicks?: number;
  ctaClicksPerMessage?: Record<string, number>;
}

export interface ContactInformationField {
  required: boolean;
  visible: boolean;
}

export interface ShareContactForm extends ShareBase {
  type: 'contact-form';
  submissions: number;
  contactInformation: {
    firstName: ContactInformationField;
    lastName: ContactInformationField;
    phone: ContactInformationField;
    email: ContactInformationField;
  };
  autoCreateContact: boolean;
  customFields?: Array<{
    id: string;
    value: any;
  }>;
}

export type Share = ShareVideo | ShareContactForm;

// Snippet related types
export interface Snippet {
  id: string;
  name: string;
  value: string;
  orgId: string;
  createdAt: number;
  updatedAt?: number;
}

export interface CreateSnippetParams extends Omit<Snippet, 'id'> {}

export interface UpdateSnippetParams {
  name?: string;
  value?: string;
}

// Sync related types
export type SyncProvider = 'salesforce' | 'raisers-edge' | 'csv-import' | 'pipedrive';
export type SyncStatus = 'pending' | 'resolved';
export type SyncType =
  | 'updated'
  | 'created'
  | 'update-failed'
  | 'multiple-contacts-match'
  | 'create-failed'
  | 'no-unique-fields'
  | 'unknown'
  | 'invalid-data'
  | 'pending-twitter-validation';

export interface SyncContactConflict {
  id: string;
  syncRequestId: string;
  orgId: string;
  type: SyncType;
  provider: SyncProvider;
  providerContact: unknown;
  stackedContactIds: string[];
  status: SyncStatus;
  message: string;
  errorJson?: string;
  createdAt: number;
}
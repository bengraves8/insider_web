import { ObjectId } from 'mongodb';

// Organization Status
export type OrgStatus = 'active' | 'onboarding' | 'in-review' | 'suspended' | 'canceled';

// Base Organization Interface
export interface Organization {
  id: string;
  name: string;
  logo: string;
  website?: string;
  status: OrgStatus;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  colors: {
    primary: string;
    secondary: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  customFieldsCount: number;
  stripeCustomerId?: string;
  subscriptionPlan?: string;
  trialEnds?: number;
  isTrialing?: boolean;
  pendingCancellation?: boolean;
  createdAt: number;
  updatedAt?: number;
  stripeConnectId?: string;
}

// Create Organization Parameters
export type CreateOrgParams = Omit<Organization, 'id' | 'stripeCustomerId'>;

// Update Organization Parameters
export interface UpdateOrgParams {
  name?: string;
  logo?: string;
  address?: string;
  website?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  colors?: {
    primary?: string;
    secondary?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
}

// Organization Filter Parameters
export interface OrgFilterParams {
  name?: string;
  website?: string;
  status?: OrgStatus[];
}

// Web Chat Configuration
export interface WebChatConfig {
  id: string;
  orgId: string;
  recipientId: string;
  name: string;
  logo: string | null;
  theme: {
    colorPrimary: string;
    colorSecondary: string;
  };
  strings: {
    talkToOrgBtnLabel: string;
    talkToOrgMessage: string;
    continueAnonymousBtnLabel: string;
    continueAnonymousMessage: string;
  };
  user: {
    name: string;
    role: string;
    photoUrl: string | null;
  };
  greeting: string;
  responseRate: string;
  collectEmail: boolean;
  collectName: boolean;
  allowAnonymous: boolean;
}

// AI Assistant Configuration
export interface AIAssistantConfig {
  id: string;
  orgId: string;
  orgContext: string;
}

// Create AI Assistant Configuration Parameters
export type CreateAIAssistantConfig = Omit<AIAssistantConfig, 'id'>;

// Onboarding Configuration
export interface Onboarding {
  id: string;
  orgId: string;
  numberOfUsers: number;
  primaryReasonForCreatingAccount: string;
  communicationChannels: string[];
  integrateWithApps: string[];
  contactFrequency: 'quarterly' | 'monthly' | 'weekly' | 'daily';
  howDidYouHearAboutStakd: string;
  subscriptionPlan: string;
  referralCode?: string;
  createdAt: number;
  updatedAt?: number;
}
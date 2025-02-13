import { Media } from './media';

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

export interface ShareWithMedia extends Share {
  media: Media;
}

export type ShareUpdate = {
  title?: string;
  description?: string;
  active?: boolean;
} & (
  | {
      type: 'video';
      ctaEnabled?: boolean;
      ctaUrl?: string;
      ctaTitle?: string;
    }
  | {
      type: 'contact-form';
      autoCreateContact?: boolean;
      contactInformation?: ShareContactForm['contactInformation'];
    }
);
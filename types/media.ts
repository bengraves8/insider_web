export type MediaType =
  | 'image/gif'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'video/mp4'
  | 'video/quicktime'
  | 'application/pdf'
  | 'text/vcard';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface MediaUrls {
  thumbnail: string;
  original: string;
}

export interface Media {
  id: string;
  orgId: string;
  userId?: string;
  contactId?: string;
  name: string;
  url: MediaUrls;
  type: MediaType;
  size: number;
  createdAt: number;
  updatedAt?: number;
  archived: boolean;
  deleted: boolean;
  dimensions?: ImageDimensions;
}

export interface MediaUploadParams {
  name: string;
  file: File;
  userId?: string;
  contactId?: string;
  type: MediaType;
}

export interface MediaUpdateParams {
  userId?: string;
  contactId?: string;
  name?: string;
  url?: MediaUrls;
  type?: MediaType;
  size?: number;
  archived?: boolean;
  deleted?: boolean;
}
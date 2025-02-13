export type MediaType =
  | 'video'
  | 'image'
  | 'folder'
  | 'pdf'
  | 'gif';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface Media {
  id: string;
  type: MediaType;
  title: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  duration?: string;
  views?: number;
  collaborators?: Array<{
    name: string;
    avatar: string;
  }>;
  tags?: string[];
  dimensions?: ImageDimensions;
}

export interface MediaUploadParams {
  name: string;
  file: File;
  type: MediaType;
}

export interface MediaUpdateParams {
  name?: string;
  title?: string;
  thumbnail?: string;
  type?: MediaType;
  size?: number;
  tags?: string[];
}
import { User as FirebaseUser } from 'firebase/auth';
import { Timestamp, DocumentData } from 'firebase/firestore';

// Base Firebase document interface
export interface FirebaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Firebase configuration interface
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// User role type
export type FirebaseUserRole = 'admin' | 'user' | 'guest';

// User permissions interface
export interface FirebaseUserPermissions {
  messages: boolean;
  contacts: boolean;
  media: boolean;
  analytics: boolean;
  settings: boolean;
  chat: boolean;
  integrations: boolean;
}

// User data interface
export interface FirebaseUserData extends FirebaseDocument {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  orgId: string;
  role: FirebaseUserRole;
  permissions: FirebaseUserPermissions;
  lastLogin?: Timestamp;
  status: 'active' | 'inactive' | 'suspended';
}

// Organization data interface
export interface FirebaseOrgData extends FirebaseDocument {
  name: string;
  logo?: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  ownerId: string;
  members: string[];
  settings: {
    allowGuestAccess: boolean;
    requireEmailVerification: boolean;
    defaultUserRole: FirebaseUserRole;
  };
}

// Firestore converter type
export interface FirestoreDataConverter<T> {
  toFirestore(modelObject: T): DocumentData;
  fromFirestore(snapshot: DocumentData): T;
}

// Auth user type
export type FirebaseAuthUser = FirebaseUser;

// Storage file metadata
export interface FirebaseStorageMetadata {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  md5Hash: string;
  customMetadata?: Record<string, string>;
}
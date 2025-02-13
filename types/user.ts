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
  phone?: string;
  role: UserRole;
  profileImg?: string;
  permissions: UserPermissions;
  createdAt: number;
  updatedAt: number;
  authId: string; // Firebase auth ID
}

export interface CreateUserParams extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  profileImg?: string;
  permissions?: Partial<UserPermissions>;
}
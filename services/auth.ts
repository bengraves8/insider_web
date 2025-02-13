import { apiRequest } from './api';
import { SignInCredentials, SignUpCredentials, AuthUser } from '@/types/auth';

export const authApi = {
  signIn: async (credentials: SignInCredentials) => {
    return apiRequest<AuthUser>({
      url: '/auth/signin',
      method: 'POST',
      data: credentials,
    });
  },

  signUp: async (credentials: SignUpCredentials) => {
    return apiRequest<AuthUser>({
      url: '/auth/signup',
      method: 'POST',
      data: credentials,
    });
  },

  signOut: async () => {
    return apiRequest<void>({
      url: '/auth/signout',
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiRequest<AuthUser>({
      url: '/auth/me',
      method: 'GET',
    });
  },
};
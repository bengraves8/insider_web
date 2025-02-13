'use client';

import { createContext, useContext, useState } from 'react';
import { User } from 'firebase/auth';
import { FirebaseUserData } from '@/types/firebase';

interface AuthContextType {
  user: User | null;
  userData: FirebaseUserData | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: false,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // For testing, create a mock user
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
  } as User;

  const mockUserData = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'admin',
    permissions: {
      messages: true,
      contacts: true,
      media: true,
      analytics: true,
      settings: true,
      chat: true,
      integrations: true
    },
    status: 'active',
  } as FirebaseUserData;

  const [user] = useState<User | null>(mockUser);
  const [userData] = useState<FirebaseUserData | null>(mockUserData);
  const [loading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = async () => {
    // No-op for testing
    console.log('Sign in bypassed for testing');
  };

  const signUp = async () => {
    // No-op for testing
    console.log('Sign up bypassed for testing');
  };

  const logout = async () => {
    // No-op for testing
    console.log('Logout bypassed for testing');
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, error, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
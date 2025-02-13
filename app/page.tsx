'use client';

import { useAuth } from '@/contexts/auth-context';
import { HomePage } from '@/components/pages/home';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <HomePage />;
}
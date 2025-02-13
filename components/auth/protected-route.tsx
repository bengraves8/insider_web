'use client';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Bypass protection for testing
  return <>{children}</>;
}
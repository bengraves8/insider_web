import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthProvider } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Data Assistant',
  description: 'Your intelligent data analysis companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <ProtectedRoute>
              <div className="flex h-screen bg-background">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 overflow-auto">
                    {children}
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
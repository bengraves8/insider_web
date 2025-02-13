'use client';

import { User } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="flex flex-col h-full ml-[60px]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Account</h2>
            <p className="text-muted-foreground">
              This feature is coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
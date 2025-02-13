'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="h-14 border-b bg-card px-6 flex items-center">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img 
            src="https://app.stakd.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstacked-messenger.appspot.com%2F64385c08dd77ed2330fab5fd%2Fmedia%2Fuploads%2F6798028fb3efae235a0cb1a1.png&w=2048&q=75"
            alt="Stakd Logo"
            className="h-8 w-auto"
          />
          <h1 className="text-lg font-semibold pl-1">Communication Co-Pilot</h1>
        </Link>
      </div>
    </header>
  );
}
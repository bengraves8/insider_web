'use client';

import {
  Calendar,
  ClipboardList,
  Users,
  MessageSquarePlus,
  Image as ImageIcon,
  BarChart2,
  Cog,
  User,
  Bell,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const topNavItems = [
  { icon: Calendar, href: '/calendar', label: 'Calendar' },
  { icon: ClipboardList, href: '/tasks', label: 'Tasks' },
  { icon: Users, href: '/people', label: 'People' },
  { icon: MessageSquarePlus, href: '/create', label: 'Create Message' },
  { icon: ImageIcon, href: '/media', label: 'Media' },
  { icon: BarChart2, href: '/stats', label: 'Statistics' },
  { icon: Cog, href: '/settings', label: 'Settings' },
];

const bottomNavItems = [
  { icon: User, href: '/account', label: 'Account' },
  { icon: Bell, href: '/notifications', label: 'Notifications' },
  { icon: MessageSquare, href: '/chat', label: 'Chat' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[60px] h-screen bg-card border-r flex flex-col items-center py-4 fixed">
      <div className="mb-8">
        <Link href="/" className="block hover:opacity-90 transition-opacity">
          <img 
            src="https://app.stakd.co/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fstacked-messenger.appspot.com%2F64385c08dd77ed2330fab5fd%2Fmedia%2Fuploads%2F6798028fb3efae235a0cb1a1.png&w=2048&q=75"
            alt="Logo"
            className="w-[42px] h-[42px]"
          />
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {topNavItems.map(({ icon: Icon, href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors relative group',
              pathname === href && 'bg-accent'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="absolute left-12 bg-popover text-popover-foreground px-2 py-1 rounded hidden group-hover:block text-sm whitespace-nowrap z-50">
              {label}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 mb-4">
        {bottomNavItems.map(({ icon: Icon, href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors relative group',
              pathname === href && 'bg-accent'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="absolute left-12 bg-popover text-popover-foreground px-2 py-1 rounded hidden group-hover:block text-sm whitespace-nowrap z-50">
              {label}
            </span>
          </Link>
        ))}
        <div className="w-7 h-7 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import NotificationBell from './NotificationBell';
import MessageIcon from './MessageIcon';
import { useSession } from 'next-auth/react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const adminName = session?.user?.fullName || session?.user?.name || 'Admin';
  const router = useRouter();

  const handleExitAdmin = () => {
    router.push('/');
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-amber-200/60 shadow-sm z-40">
      <div className="text-2xl font-bold text-amber-900 tracking-tight">
        Admin Dashboard
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && <NotificationBell />}
        {isAdmin && <MessageIcon />}
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-amber-200 shadow text-amber-800 font-semibold">
            <UserIcon className="h-5 w-5" />
            <span className="hidden md:inline text-sm font-medium">
              {adminName}
            </span>
          </div>
        )}
        {isAdmin && (
          <button
            onClick={handleExitAdmin}
            className="p-2 rounded-full hover:bg-amber-50 transition-colors"
            aria-label="Exit admin dashboard"
            title="Exit admin dashboard"
          >
            <LogOut className="w-5 h-5 text-amber-700" />
          </button>
        )}
      </div>
    </header>
  );
}

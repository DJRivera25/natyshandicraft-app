import { Bell, UserCircle, LogOut, Menu } from 'lucide-react';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const AdminHeader: FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const adminName = session?.user?.name || session?.user?.fullName || 'Admin';

  const handleLogout = async () => {
    router.push('/');
  };

  return (
    <header className="w-full h-16 bg-white border-b border-amber-200/60 flex items-center justify-between px-2 sm:px-4 md:px-6 shadow-sm z-10">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            className="md:hidden p-2 rounded-full hover:bg-amber-50 transition-colors mr-2"
            onClick={onMenuClick}
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6 text-amber-700" />
          </button>
        )}
        <span className="text-lg font-semibold text-amber-900">
          Admin Panel
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-amber-50 transition-colors">
          <Bell className="w-5 h-5 text-amber-700" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-amber-700" />
          <span className="text-sm font-medium text-gray-800">{adminName}</span>
        </div>
        <button
          className="p-2 rounded-full hover:bg-amber-50 transition-colors"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 text-amber-700" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

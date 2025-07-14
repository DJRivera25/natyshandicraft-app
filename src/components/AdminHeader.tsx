import { Bell, UserCircle, LogOut } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="w-full h-16 bg-white border-b border-amber-200/60 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-amber-900">Admin Panel</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-amber-50 transition-colors">
          <Bell className="w-5 h-5 text-amber-700" />
          {/* Notification badge (example) */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-amber-700" />
          <span className="text-sm font-medium text-gray-800">Admin</span>
        </div>
        <button className="p-2 rounded-full hover:bg-amber-50 transition-colors">
          <LogOut className="w-5 h-5 text-amber-700" />
        </button>
      </div>
    </header>
  );
} 
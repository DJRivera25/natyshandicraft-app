import React from 'react';
import { useNotification } from './NotificationProvider';
import { CheckCircle, AlertCircle, Package, User, X } from 'lucide-react';
import Link from 'next/link';

interface Props {
  onClose: () => void;
}

const typeIcon = (type: string) => {
  switch (type) {
    case 'order_checkout':
      return <Package className="w-5 h-5 text-amber-500" />;
    case 'order_cancelled':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'user_registered':
      return <User className="w-5 h-5 text-blue-500" />;
    default:
      return <CheckCircle className="w-5 h-5 text-green-500" />;
  }
};

function timeAgo(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function NotificationDropdown({ onClose }: Props) {
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  return (
    <div className="absolute right-0 mt-2 w-80 max-w-xs sm:w-96 bg-white rounded-2xl shadow-2xl border border-amber-100 z-50 animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <span className="font-semibold text-amber-900 text-base">
          Notifications
        </span>
        <button
          className="p-1 rounded-full hover:bg-amber-100"
          aria-label="Close notifications"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-amber-500" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-amber-50">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-amber-700 text-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={String(n._id)}
              className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.read ? 'bg-white' : 'bg-amber-50/60'}`}
            >
              <div className="pt-1">{typeIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-amber-900 font-medium truncate">
                  {n.message}
                </div>
                <div className="text-xs text-amber-500 mt-0.5">
                  {timeAgo(n.createdAt)}
                </div>
              </div>
              {!n.read && (
                <button
                  className="ml-2 px-2 py-1 text-xs rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
                  onClick={() => markAsRead(n._id)}
                >
                  Mark as read
                </button>
              )}
              {typeof n.meta?.link === 'string' && (
                <Link
                  href={n.meta.link}
                  className="ml-2 px-2 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  onClick={onClose}
                >
                  View
                </Link>
              )}
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-amber-100 bg-amber-50 flex justify-end">
          <button
            className="text-xs text-amber-700 font-semibold hover:underline"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}

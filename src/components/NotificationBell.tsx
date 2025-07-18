import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from './NotificationProvider';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
  const { unreadCount } = useNotification();
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={bellRef}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell
          className={`w-6 h-6 ${unreadCount > 0 ? 'text-amber-500 animate-bounce' : 'text-gray-400'}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}

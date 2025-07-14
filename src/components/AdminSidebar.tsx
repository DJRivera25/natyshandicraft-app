'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageCircle,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/chat', label: 'Chat', icon: MessageCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-full w-64 bg-white border-r border-amber-200/60 flex flex-col py-6 px-4 shadow-sm">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="text-2xl font-bold text-amber-700">Admin</span>
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2">
          Dashboard
        </span>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors
              ${
                pathname.startsWith(href)
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900'
              }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

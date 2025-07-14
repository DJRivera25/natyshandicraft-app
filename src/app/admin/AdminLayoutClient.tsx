'use client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import type { ReactNode } from 'react';
import { useState } from 'react';

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-amber-50">
      {/* Sidebar: hidden on mobile, slide-in on open */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white border-r border-amber-200/60 flex flex-col py-6 px-4 shadow-sm transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}
        style={{ maxWidth: '100vw' }}
      >
        <AdminSidebar />
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-2 sm:p-4 md:p-6 pt-2 bg-amber-50 overflow-y-auto max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

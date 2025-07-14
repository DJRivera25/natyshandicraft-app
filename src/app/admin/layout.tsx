import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-amber-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />

        <main className="flex-1 p-6 pt-2 bg-amber-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

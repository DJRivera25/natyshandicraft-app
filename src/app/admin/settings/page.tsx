'use client';

import AdminButton from '@/components/AdminButton';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-amber-200/60 flex flex-col items-center justify-center min-h-[240px]">
        <p className="text-gray-700 text-sm mb-6 text-center">
          Admin settings management will be implemented here soon.
          <br />
          Configure your store, notifications, and more.
        </p>
        <AdminButton variant="primary" disabled>
          Edit Settings (Coming Soon)
        </AdminButton>
      </div>
    </div>
  );
}

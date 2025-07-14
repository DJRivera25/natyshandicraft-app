'use client';

import AdminButton from '@/components/AdminButton';
import AdminLoading from '@/components/AdminLoading';

export default function AdminChatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Chat Inbox</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-amber-200/60 flex flex-col items-center justify-center min-h-[240px]">
        <AdminLoading message="Preparing real-time chat..." />
        <p className="text-gray-700 text-sm mt-4 mb-6 text-center">
          Real-time chat with users will be implemented here soon.
          <br />
          Stay tuned for live support and messaging!
        </p>
        <AdminButton variant="primary" disabled>
          Start Chatting (Coming Soon)
        </AdminButton>
      </div>
    </div>
  );
}

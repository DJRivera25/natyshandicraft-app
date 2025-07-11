'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AuthSyncer from '@/lib/AuthSyncer';
import MergeGuestCart from '@/lib/MergeGuestCart'; // or wherever you keep this logic
import { ToastProvider } from '@/components/Toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ToastProvider>
          {/* Global state handlers */}
          <AuthSyncer />
          <MergeGuestCart />

          {/* Actual app UI */}
          {children}
        </ToastProvider>
      </Provider>
    </SessionProvider>
  );
}

'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AuthSyncer from '@/lib/AuthSyncer';
import MergeGuestCart from '@/lib/MergeGuestCart'; // or wherever you keep this logic

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {/* Global state handlers */}
        <AuthSyncer />
        <MergeGuestCart />

        {/* Actual app UI */}
        {children}
      </Provider>
    </SessionProvider>
  );
}

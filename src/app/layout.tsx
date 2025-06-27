'use client';

import { ReactNode } from 'react';
import './globals.css'; // Tailwind or global styles
import Navbar from '@/components/Navbar';
import Providers from './providers'; // includes Redux + SessionProvider
import AuthSyncer from '@/components/AuthSyncer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthSyncer />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

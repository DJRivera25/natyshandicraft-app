'use client';

import { ReactNode } from 'react';
import './globals.css'; // Tailwind or global styles
import Navbar from '@/components/Navbar';
import Providers from './providers'; // includes Redux + SessionProvider

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

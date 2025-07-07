import './globals.css';
import type { ReactNode } from 'react';
import Providers from './providers';
import ClientWrapper from '@/components/ClientWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50
          text-amber-900 font-sans antialiased
          selection:bg-amber-300 selection:text-amber-900
          scroll-smooth"
      >
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}

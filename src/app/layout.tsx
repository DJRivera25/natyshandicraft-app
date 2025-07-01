'use client';

import { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from './providers';
// import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  // const pathname = usePathname();

  // const hideNavbarRoutes = ['/complete-profile']; // you can add more routes here
  // const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <Providers>
          {/* {!shouldHideNavbar && <Navbar />} */}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

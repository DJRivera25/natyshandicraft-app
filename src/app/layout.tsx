'use client';

import { useEffect, ReactNode } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import './globals.css';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/BreadCrumb';
import Providers from './providers';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isProductDetailPage = /^\/products\/[^/]+$/.test(pathname); // e.g. /products/abc123

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80, // how far before the element becomes visible
    });
  }, []);

  return (
    <html lang="en">
      <body
        className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50
          text-amber-900 font-sans antialiased
          selection:bg-amber-300 selection:text-amber-900
          scroll-smooth"
      >
        <Providers>
          <Navbar />
          {!isLoginPage && !isHomePage && !isProductDetailPage && (
            <div className="pt-4 px-4 md:px-6">
              <Breadcrumb />
            </div>
          )}
          <div className={isHomePage ? '' : ''}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}

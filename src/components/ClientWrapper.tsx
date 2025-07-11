'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Breadcrumb from './BreadCrumb';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isCompleteProfilePage = pathname === '/complete-profile';
  const isProductDetailPage = /^\/products\/[^/]+$/.test(pathname); // e.g. /products/abc123

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80 });
  }, []);

  return (
    <>
      <Navbar />
      {!isLoginPage &&
        !isCompleteProfilePage &&
        !isHomePage &&
        !isProductDetailPage && (
          <div className="pt-4 px-4 md:px-6">
            <Breadcrumb />
          </div>
        )}
      <div>{children}</div>
    </>
  );
}

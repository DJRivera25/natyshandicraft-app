import './globals.css';
import type { ReactNode } from 'react';
import Providers from './providers';
import ClientWrapper from '@/components/ClientWrapper';

export const metadata = {
  title: {
    default: "Naty's Handycrafts",
    template: "%s | Naty's Handycrafts",
  },
  description:
    'Handcrafted Filipino products by Lola Naty. Discover unique, traditional, and sustainable crafts for your home and lifestyle.',
  openGraph: {
    title: "Naty's Handycrafts",
    description:
      'Handcrafted Filipino products by Lola Naty. Discover unique, traditional, and sustainable crafts for your home and lifestyle.',
    url: 'https://natyshandicraft-app.vercel.app/',
    siteName: "Naty's Handycrafts",
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Naty's Handycrafts",
    description:
      'Handcrafted Filipino products by Lola Naty. Discover unique, traditional, and sustainable crafts for your home and lifestyle.',
    creator: '@natyshandicraft',
    site: '@natyshandicraft',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

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

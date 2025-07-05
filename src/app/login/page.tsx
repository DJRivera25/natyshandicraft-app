'use client';

import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginSpinner from '@/components/LoginSpinner';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const { birthDate, mobileNumber, address } = session.user;
      if (!birthDate || !mobileNumber || !address) {
        router.replace('/complete-profile');
      } else {
        router.replace('/');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') return <LoginSpinner />;

  if (status === 'authenticated' && session?.user) return null;

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-amber-50 via-amber-100 to-amber-50 px-6 py-12 sm:px-12"
    >
      {/* Subtle craft pattern overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100 via-amber-50 to-transparent opacity-20"
      />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-amber-300 bg-white/90 backdrop-blur-sm shadow-xl p-10 space-y-8">
        {/* Header */}
        <header className="space-y-3 text-center">
          <h1 className="text-5xl font-serif font-extrabold tracking-tight text-amber-900 drop-shadow-sm">
            Naty’s Handycrafts
          </h1>
          <p className="text-amber-700 font-medium text-lg sm:text-xl leading-relaxed">
            Crafted by your Lola Naty — tradition, nature, and warmth in every
            piece.
          </p>
        </header>

        {/* Buttons */}
        <div className="flex flex-col gap-5">
          {/* Google Sign-in */}
          <button
            onClick={() => signIn('google')}
            className="flex items-center justify-center gap-4 rounded-lg bg-amber-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-transform hover:scale-[1.05] hover:bg-amber-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            aria-label="Sign in with Google"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 48 48"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083h-1.25v-.02H24v8h11.944c-1.067 5.16-5.56 8.857-11.937 8.857-7.02 0-12.737-5.76-12.737-12.87s5.717-12.868 12.737-12.868c3.254 0 6.244 1.254 8.482 3.304l5.956-5.968C34.643 7.625 29.686 5.5 24 5.5 12.955 5.5 4.504 14.053 4.504 25.145s8.451 19.645 19.496 19.645c11.278 0 18.885-7.914 18.885-19.77 0-1.33-.143-2.414-.274-3.337z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.144 4.51C13.297 16.307 18.126 12.5 24 12.5c3.254 0 6.244 1.254 8.482 3.304l5.956-5.968C34.643 7.625 29.686 5.5 24 5.5c-6.011 0-11.437 3.42-14.928 8.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 43.645c5.468 0 10.302-1.803 13.736-4.886l-6.329-5.172c-1.824 1.352-4.154 2.14-7.407 2.14-5.34 0-9.877-3.527-11.507-8.275l-6.271 4.82C9.908 39.641 16.3 43.645 24 43.645z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083h-1.25v-.02H24v8h11.944c-1.067 5.16-5.56 8.857-11.937 8.857v7.705c11.279 0 18.885-7.914 18.885-19.77 0-1.33-.143-2.414-.274-3.337z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Facebook Sign-in */}
          <button
            onClick={() => signIn('facebook')}
            className="flex items-center justify-center gap-4 rounded-lg bg-blue-700 px-6 py-3 text-lg font-semibold text-white shadow-md transition-transform hover:scale-[1.05] hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="Sign in with Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.325-.597 1.325-1.333V1.333c0-.736-.595-1.333-1.325-1.333z" />
            </svg>
            Sign in with Facebook
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-amber-800 select-none">
          © {new Date().getFullYear()} Naty’s Handycrafts — Filipino
          handcrafted with love ❤️
        </p>
      </section>
    </motion.main>
  );
}

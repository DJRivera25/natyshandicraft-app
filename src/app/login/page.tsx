'use client';

import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginSpinner from '@/components/LoginSpinner';
import PageWrapper from '@/components/PageWrapper';
import { Sparkles, Heart, Shield, Zap } from 'lucide-react';

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
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900">
                Naty&apos;s Handycrafts
              </h1>
            </div>
            <p className="text-amber-700 text-sm sm:text-base leading-relaxed">
              Crafted by your Lola Naty — tradition, nature, and warmth in every
              piece
            </p>
          </motion.div>

          {/* Main Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-amber-200/60 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 sm:px-6 py-4 sm:py-6 border-b border-amber-200/60">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-600" />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-amber-900">
                    Welcome Back
                  </h2>
                  <p className="text-amber-700 text-sm">
                    Sign in to continue your crafting journey
                  </p>
                </div>
              </div>
            </div>

            {/* Login Options */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Google Sign-in */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md text-sm"
                aria-label="Sign in with Google"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                Continue with Google
              </motion.button>

              {/* Facebook Sign-in */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn('facebook')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md text-sm"
                aria-label="Sign in with Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.325-.597 1.325-1.333V1.333c0-.736-.595-1.333-1.325-1.333z" />
                </svg>
                Continue with Facebook
              </motion.button>
            </div>

            {/* Features Section */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-gray-600">Fast & Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-gray-600">
                    Privacy Protected
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Heart className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-gray-600">
                    Handcrafted Love
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6 sm:mt-8"
          >
            <p className="text-amber-700 text-sm flex items-center justify-center gap-1">
              <Heart className="w-3 h-3" />© {new Date().getFullYear()}{' '}
              Naty&apos;s Handycrafts — Filipino handcrafted with love
              <Heart className="w-3 h-3" />
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}

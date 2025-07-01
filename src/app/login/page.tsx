'use client';

import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🧠 Handle redirect in useEffect
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

  if (status === 'loading') return null;

  // Prevent showing login page if already authenticated
  if (status === 'authenticated' && session?.user) return null;

  return (
    <div>
      <h1>Login</h1>
      <button
        onClick={() => {
          signIn('google');
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

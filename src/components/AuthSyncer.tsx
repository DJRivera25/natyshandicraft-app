// app/components/AuthSyncer.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { login, logout } from '@/features/auth/authSlice';
import { useEffect } from 'react';

export default function AuthSyncer() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      dispatch(
        login({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.fullName!,
          isAdmin: session.user.isAdmin!,
          mobileNumber: session.user.mobileNumber ?? undefined,
          address: session.user.address ?? undefined,
          birthDate: session.user.birthDate ?? undefined,
        })
      );
    } else {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  return null;
}

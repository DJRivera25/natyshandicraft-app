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
      const { id, email, fullName, isAdmin, mobileNumber, birthDate, address } =
        session.user;

      dispatch(
        login({
          id,
          email: email!,
          fullName: fullName!,
          isAdmin: isAdmin!,
          mobileNumber: mobileNumber ?? undefined,
          birthDate: birthDate ?? undefined,
          address: address ?? undefined, // ✅ structured address object
        })
      );
    } else {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  return null;
}

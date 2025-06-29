// src/types/next-auth.d.ts

import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
      fullName?: string | null;
      mobileNumber?: string | null;
      address?: string | null;
      birthDate?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    isAdmin?: boolean;
    fullName?: string | null;
    mobileNumber?: string | null;
    address?: string | null;
    birthDate?: string | null;
  }
}

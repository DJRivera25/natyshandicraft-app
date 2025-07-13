// src/types/next-auth.d.ts

import type { JWT as DefaultJWT } from 'next-auth/jwt';

interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

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
      birthDate?: string | null;
      address?: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
      } | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    isAdmin?: boolean;
    fullName?: string | null;
    mobileNumber?: string | null;
    birthDate?: string | null;
    address?: Address;
  }
}

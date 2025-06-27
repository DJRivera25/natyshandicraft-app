'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { signOut } from 'next-auth/react';
import { logout } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.isAdmin;
  const isAuthenticated = !!user;

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    dispatch(logout());
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          🛍️ Natys Handicrafts
        </Link>

        {/* Right Links */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Admin
            </Link>
          )}

          <Link
            href="/products"
            className="text-sm font-medium text-gray-700 hover:underline"
          >
            Products
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {hasMounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="text-sm text-gray-700 hover:underline"
              >
                {user?.fullName || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-700 hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

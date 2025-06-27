'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { signOut } from 'next-auth/react';
import { logout } from '@/features/auth/authSlice'; // adjust path as needed
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);
  console.log(`user`, user);
  const isAuthenticated = !!user;
  console.log(`isAuthenticated`, isAuthenticated);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isAdmin = user?.isAdmin;

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    // 1. Clear Redux state
    dispatch(logout());

    // 2. Sign out NextAuth session (this also clears cookies/session)
    await signOut({ redirect: false }); // prevent automatic redirect

    // 3. Manually redirect
    router.push('/login'); // or '/' if you want home
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          🛍️ Natys Handicrafts
        </Link>

        {/* Right Links */}
        {/* Right Links */}
        <div className="flex items-center gap-4">
          {/* Admin Link */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Admin
            </Link>
          )}

          {/* Products Link */}
          <Link
            href="/products"
            className="text-sm font-medium text-gray-700 hover:underline"
          >
            Products
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
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

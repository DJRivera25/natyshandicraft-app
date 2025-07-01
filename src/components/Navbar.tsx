'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/authSlice';
import { clearCart } from '@/features/cart/cartSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin;
  const isProfileComplete = useAppSelector(
    (state) => state.auth.isProfileComplete
  );

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem(`cartMerged-${user?.id}`);
    await signOut({ redirect: false });
    router.push('/login');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
    ...(isAuthenticated
      ? [
          { label: user?.fullName || 'Profile', href: '/profile' },
          { label: 'My Orders', href: '/profile/orders' },
        ]
      : [{ label: 'Login', href: '/login' }]),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow border-b border-neutral-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-amber-900 flex items-center gap-2"
        >
          <span className="text-3xl">🌾</span>
          <span className="font-serif">Naty’s Handycrafts</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-amber-800 transition"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && isProfileComplete && (
            <button
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 transition"
            >
              Logout
            </button>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart className="h-6 w-6 text-neutral-700 hover:text-amber-800 transition" />
            {hasMounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-neutral-700 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-base text-neutral-700 hover:text-amber-800 transition"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && isProfileComplete && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block text-base text-rose-600 hover:text-rose-700"
            >
              Logout
            </button>
          )}

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-base text-neutral-700 hover:text-amber-800"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
            {hasMounted && cartCount > 0 && (
              <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}

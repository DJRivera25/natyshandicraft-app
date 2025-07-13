'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/features/auth/authSlice';
import { clearCart } from '@/features/cart/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { setQuery } from '@/features/product/productSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin;
  const isProfileComplete = useAppSelector(
    (state) => state.auth.isProfileComplete
  );

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearCart());
    localStorage.removeItem(`cartMerged-${user?.id}`);
    await signOut({ callbackUrl: '/login' });
    console.log(`user when logout`, user);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') return;
    await dispatch(setQuery(searchTerm));
    setSearchTerm('');
    router.push('/products');
    setShowMobileSearch(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow border-b border-neutral-200"
    >
      <div className="mx-auto flex items-center justify-between gap-y-2 px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 max-w-7xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-neutral-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <X className="lg:hidden h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="lg:hidden h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>

          <Link
            href="/"
            className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-amber-900 flex items-center gap-2"
          >
            <span className="font-serif">Naty&apos;s Handycrafts</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-neutral-700">
          <Link href="/products" className="hover:text-amber-800 transition">
            Products
          </Link>
          <Link
            href="/products?onSale=true"
            className="hover:text-amber-800 transition"
          >
            On Sale
          </Link>
          <Link
            href="/products?sortBy=newest"
            className="hover:text-amber-800 transition"
          >
            New Arrivals
          </Link>
          {isAdmin && (
            <Link href="/admin" className="hover:text-amber-800 transition">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center w-64 lg:w-80 xl:w-[28rem] 2xl:w-[32rem]"
          >
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <Search size={14} className="sm:w-4 sm:h-4" />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-amber-300 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </form>

          <button
            className="md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700 hover:text-amber-800 transition" />
          </button>

          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700 hover:text-amber-800 transition" />
            {hasMounted && cartCount > 0 && (
              <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-700 hover:text-amber-800"
              >
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden md:inline">
                  {user?.fullName?.split(' ')[0] || 'User'}
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-neutral-200 z-50"
                  >
                    {!isProfileComplete ? (
                      <Link
                        href="/complete-profile"
                        className="block px-4 py-2 text-sm text-amber-700 font-semibold hover:bg-amber-100"
                      >
                        Complete Profile
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-amber-100"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/profile/orders"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-amber-100"
                        >
                          My Orders
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-neutral-700 hover:text-amber-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {showMobileSearch && (
        <div className="md:hidden px-4 py-3 border-t border-neutral-200 bg-white">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border border-amber-300 rounded-md overflow-hidden"
          >
            <span className="px-3 text-neutral-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-2 text-sm focus:outline-none"
            />
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="block text-base text-neutral-700 hover:text-amber-800"
          >
            Products
          </Link>
          <Link
            href="/products?onSale=true"
            onClick={() => setMenuOpen(false)}
            className="block text-base text-neutral-700 hover:text-amber-800"
          >
            On Sale
          </Link>
          <Link
            href="/products?sortBy=newest"
            onClick={() => setMenuOpen(false)}
            className="block text-base text-neutral-700 hover:text-amber-800"
          >
            New Arrivals
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block text-base text-neutral-700 hover:text-amber-800"
            >
              Admin
            </Link>
          )}
          {!isAuthenticated && (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-base text-neutral-700 hover:text-amber-800"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </motion.header>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, User, Search, Sparkles } from 'lucide-react';
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
      className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl shadow-lg border-b border-amber-200/60"
      style={{
        background:
          'linear-gradient(90deg, rgba(255,251,235,0.95) 0%, rgba(255,247,222,0.85) 100%)',
      }}
    >
      <div className="mx-auto flex items-center justify-between gap-y-2 px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 max-w-7xl">
        {/* Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-amber-700 focus:outline-none rounded-lg p-2 hover:bg-amber-100/60 transition lg:hidden"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight text-amber-900 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent select-none"
          >
            <Sparkles className="w-6 h-6 text-amber-500 drop-shadow" />
            <span className="font-serif">Naty&apos;s Handicraft</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4 text-sm font-semibold">
          <Link
            href="/products"
            className="relative px-1.5 py-0.5 text-neutral-800 hover:text-amber-700 transition after:content-[''] after:block after:h-0.5 after:bg-amber-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left after:duration-200"
          >
            Products
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="relative px-1.5 py-0.5 text-amber-700 font-bold border-b-2 border-amber-400"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Search, Cart, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center w-64 lg:w-80 xl:w-[28rem] 2xl:w-[32rem]"
          >
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-amber-400">
                <Search size={18} className="sm:w-5 sm:h-5" />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-amber-200 bg-white/80 shadow focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm transition-all"
              />
            </div>
          </form>

          {/* Cart Icon */}
          <Link href="/cart" className="relative group" aria-label="Cart">
            <motion.div
              whileTap={{ scale: 0.92 }}
              className="rounded-full p-2 bg-gradient-to-br from-amber-100 to-yellow-50 border border-amber-200 shadow hover:shadow-lg transition"
            >
              <ShoppingCart className="h-5 w-5 text-amber-700 group-hover:text-amber-900 transition" />
              {hasMounted && cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.div>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-amber-200 shadow hover:bg-amber-100/80 text-amber-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline">
                  {user?.fullName?.split(' ')[0] || 'User'}
                </span>
              </motion.button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl bg-white/95 ring-1 ring-amber-200 z-50 overflow-hidden border border-amber-100"
                  >
                    {!isProfileComplete ? (
                      <Link
                        href="/complete-profile"
                        className="block px-4 py-3 text-sm text-amber-700 font-semibold hover:bg-amber-50 transition"
                      >
                        Complete Profile
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/profile"
                          className="block px-4 py-3 text-sm text-neutral-700 hover:bg-amber-50 transition"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/profile/orders"
                          className="block px-4 py-3 text-sm text-neutral-700 hover:bg-amber-50 transition"
                        >
                          My Orders
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition"
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
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow hover:from-amber-500 hover:to-amber-700 transition font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden px-4 py-3 border-t border-amber-200 bg-white/95 backdrop-blur-xl shadow-lg"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border border-amber-300 rounded-xl overflow-hidden shadow"
          >
            <span className="px-3 text-amber-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-2 text-sm focus:outline-none bg-white/90"
            />
          </form>
        </motion.div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/20"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 h-full w-72 max-w-[90vw] bg-gradient-to-b from-white/95 to-amber-50/90 shadow-2xl p-6 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end text-amber-700 hover:bg-amber-100 rounded-full p-2 transition"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-lg font-semibold text-amber-900 hover:bg-amber-100 transition"
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-amber-400 to-amber-600 shadow hover:from-amber-500 hover:to-amber-700 transition"
                >
                  Admin
                </Link>
              )}
              <div className="flex-1" />
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl text-lg font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full block px-4 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-amber-400 to-amber-600 shadow hover:from-amber-500 hover:to-amber-700 transition text-center"
                >
                  Login
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

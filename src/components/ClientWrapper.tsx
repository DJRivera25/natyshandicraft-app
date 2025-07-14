'use client';

import React, { useState, useEffect } from 'react';
import FloatingChatWindow from './FloatingChatWindow';
import { useChat } from './ChatProvider';
import { useSession } from 'next-auth/react';
import { MessageCircle } from 'lucide-react';
import Navbar from './Navbar';
import Breadcrumb from './BreadCrumb';
import { usePathname } from 'next/navigation';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeRoom, setActiveRoom, chatRooms, unreadCount } = useChat();
  const [showChat, setShowChat] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const isAuthenticated = !!session?.user;
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isCompleteProfilePage = pathname === '/complete-profile';
  const isThankYouPage = pathname === '/complete-profile/thank-you';
  const isProductDetailPage = /^\/products\/[^/]+$/.test(pathname);
  const isAdminPage = pathname.startsWith('/admin');

  // Debug log to help diagnose floating chat window issues
  console.log('ClientWrapper:', {
    isAuthenticated,
    isAdmin,
    showChat,
    activeRoom,
    chatRooms,
  });

  // Open chat window when a room is selected
  useEffect(() => {
    if (activeRoom) setShowChat(true);
  }, [activeRoom]);

  return (
    <>
      {/* Restore Navbar for user-facing pages */}
      {!isAdminPage && <Navbar />}
      {/* Restore Breadcrumb for user-facing pages except special ones */}
      {!isLoginPage &&
        !isCompleteProfilePage &&
        !isThankYouPage &&
        !isHomePage &&
        !isProductDetailPage &&
        !isAdminPage && (
          <div className="pt-4 px-4 md:px-6">
            <Breadcrumb />
          </div>
        )}
      <div>{children}</div>
      {/* Floating chat button for authenticated, non-admin users only */}
      {isAuthenticated && !isAdmin && (
        <>
          {/* Debug log for floating chat button click */}
          <button
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            aria-label="Chat with admin"
            onClick={() => {
              console.log('Floating chat button clicked');
              setShowChat(true);
            }}
            style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
          >
            <MessageCircle className="w-7 h-7" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          {showChat && (
            <FloatingChatWindow
              onClose={() => {
                console.log('FloatingChatWindow closed');
                setShowChat(false);
                setActiveRoom(null);
              }}
              showWelcome={
                !activeRoom && (!chatRooms || chatRooms.length === 0)
              }
            />
          )}
        </>
      )}
    </>
  );
}

'use client';

import React, { useState } from 'react';
import NotificationBell from './NotificationBell';
import MessageIcon from './MessageIcon';
import FloatingChatWindow from './FloatingChatWindow';
import { useChat } from './ChatProvider';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeRoom, setActiveRoom } = useChat();
  const [showChat, setShowChat] = useState(false);

  // Open chat window when a room is selected
  React.useEffect(() => {
    if (activeRoom) setShowChat(true);
  }, [activeRoom]);

  return (
    <>
      {/* Top-right icons (z-50 to float above content) */}
      <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-50 flex gap-2">
        <NotificationBell />
        <MessageIcon />
      </div>
      {children}
      {/* Floating chat window (bottom-right) */}
      {showChat && (
        <FloatingChatWindow
          onClose={() => {
            setShowChat(false);
            setActiveRoom(null);
          }}
        />
      )}
    </>
  );
}

'use client';

import React from 'react';

interface MobileBackdropProps {
  isSidebarOpen: boolean;
  onClose: () => void;
}

const MobileBackdrop: React.FC<MobileBackdropProps> = ({
  isSidebarOpen,
  onClose,
}) => {
  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
    />
  );
};

export default MobileBackdrop;

import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

type Variant = 'primary' | 'danger' | 'outline';

interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function AdminButton({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500',
        {
          'bg-amber-600 text-white hover:bg-amber-700': variant === 'primary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'bg-white border border-amber-300 text-amber-700 hover:bg-amber-50':
            variant === 'outline',
          'w-full': fullWidth,
          'opacity-50 cursor-not-allowed': loading || disabled,
        },
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

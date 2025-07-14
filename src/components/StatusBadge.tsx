import React from 'react';
import clsx from 'clsx';

type Status =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'processing'
  | 'active'
  | 'inactive'
  | 'banned';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusMap: Record<Status, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
  processing: { label: 'Processing', color: 'bg-amber-100 text-amber-800' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  banned: { label: 'Banned', color: 'bg-red-200 text-red-900' },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, color } = statusMap[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-800',
  };
  return (
    <span
      className={clsx(
        'inline-block px-3 py-1 rounded-full text-xs font-semibold',
        color,
        className
      )}
    >
      {label}
    </span>
  );
}

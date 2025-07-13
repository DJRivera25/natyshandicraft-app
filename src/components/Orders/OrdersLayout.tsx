'use client';

import { AnimatePresence } from 'framer-motion';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';
import type { Order } from '@/types/order';

interface OrdersLayoutProps {
  orders: Order[];
  expandedOrder: string | null;
  onToggleExpansion: (orderId: string) => void;
  onPayNow: (orderId: string, totalAmount: number) => void;
  onCancelOrder: (orderId: string) => void;
  canCancelOrder: (order: {
    status: string;
    paymentMethod?: string;
  }) => boolean;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

export default function OrdersLayout({
  orders,
  expandedOrder,
  onToggleExpansion,
  onPayNow,
  onCancelOrder,
  canCancelOrder,
  getStatusIcon,
  getStatusColor,
}: OrdersLayoutProps) {
  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {orders.map((order, index) => (
            <div key={order._id}>
              <OrderCard
                order={order}
                index={index}
                expandedOrder={expandedOrder}
                onToggleExpansion={onToggleExpansion}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
              <OrderDetails
                order={order}
                expandedOrder={expandedOrder}
                onToggleExpansion={onToggleExpansion}
                onPayNow={onPayNow}
                onCancelOrder={onCancelOrder}
                canCancelOrder={canCancelOrder}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

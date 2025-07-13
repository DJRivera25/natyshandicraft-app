'use client';

import { AnimatePresence } from 'framer-motion';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartLayoutProps {
  items: CartItemType[];
  onRemoveItem: (productId: string) => void;
  removingItem: string | null;
}

export default function CartLayout({
  items,
  onRemoveItem,
  removingItem,
}: CartLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Cart Items - Left Column */}
      <div className="flex-1 space-y-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <CartItem
              key={item.productId}
              item={item}
              index={index}
              onRemove={onRemoveItem}
              removingItem={removingItem}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

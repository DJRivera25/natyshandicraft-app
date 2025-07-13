'use client';

import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import { useAppDispatch } from '@/store/hooks';
import {
  incrementQuantity,
  decrementQuantity,
} from '@/features/cart/cartSlice';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onRemove: (productId: string) => void;
  removingItem: string | null;
}

export default function CartItem({
  item,
  index,
  onRemove,
  removingItem,
}: CartItemProps) {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className="group bg-white rounded-2xl border border-amber-200/40 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Enhanced Product Image */}
          <div className="relative flex-shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {removingItem === item.productId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                >
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-3 h-3 text-gray-400 hover:text-red-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <Eye className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Enhanced Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col h-full justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 text-base sm:text-lg truncate mb-2 group-hover:text-amber-700 transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-amber-600 font-bold text-lg">
                    {item.price.toFixed(2)}
                  </p>
                  <span className="text-gray-400 text-sm">each</span>
                  {item.price > 50 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Free Shipping
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(decrementQuantity(item.productId))}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <span className="w-8 text-center font-bold text-amber-800 text-base">
                    {item.quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(incrementQuantity(item.productId))}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-amber-700 text-lg">
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {item.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRemove(item.productId)}
                    disabled={removingItem === item.productId}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 group-hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

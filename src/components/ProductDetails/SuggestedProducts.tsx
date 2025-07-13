'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types/product';

interface SuggestedProductsProps {
  suggestedProducts: Product[];
  loadingSuggested: boolean;
  carouselIndex: number;
  onCarouselNavigation: (direction: 'prev' | 'next') => void;
}

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({
  suggestedProducts,
  loadingSuggested,
  carouselIndex,
  onCarouselNavigation,
}) => {
  const router = useRouter();

  const handleSuggestedProductClick = useCallback(
    (productId: string) => {
      router.push(`/products/${productId}`);
    },
    [router]
  );

  // Carousel visibility
  const visibleProducts = suggestedProducts.slice(
    carouselIndex,
    carouselIndex + 4
  );
  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex + 4 < suggestedProducts.length;

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-gradient-to-br from-amber-50 to-white border-t border-amber-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            You Might Also Like
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCarouselNavigation('prev')}
              disabled={!canPrev}
              className="p-1.5 sm:p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => onCarouselNavigation('next')}
              disabled={!canNext}
              className="p-1.5 sm:p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {loadingSuggested ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">
              Loading suggestions...
            </span>
          </div>
        ) : (
          <div className="relative">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              layout
            >
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((suggestedProduct, index) => (
                  <motion.div
                    key={suggestedProduct._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="group cursor-pointer"
                    onClick={() =>
                      handleSuggestedProductClick(suggestedProduct._id)
                    }
                  >
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                        <img
                          src={suggestedProduct.imageUrl || '/placeholder.jpg'}
                          alt={suggestedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Status badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {suggestedProduct.isFeatured && (
                            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-400 text-white text-xs font-bold rounded-full">
                              Featured
                            </div>
                          )}
                          {suggestedProduct.discountActive &&
                            suggestedProduct.discountPercent && (
                              <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                -{suggestedProduct.discountPercent}%
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors text-sm sm:text-base">
                          {suggestedProduct.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-amber-700">
                            {suggestedProduct.price.toLocaleString()}
                          </span>

                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{suggestedProduct.stock}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuggestedProducts;

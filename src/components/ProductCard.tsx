'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import {
  deleteProductThunk,
  toggleActiveThunk,
} from '@/features/product/productThunk';
import { addToCartThunk } from '@/features/cart/cartThunk';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Trash2,
  ShoppingCart,
  Check,
  Eye,
  EyeOff,
  Star,
  Tag,
  Package,
  TrendingUp,
  Share2,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import EditProductModal from './EditProductModal';

interface Props {
  product: Product;
  onProductUpdate?: (updatedProduct: Product) => void;
}

export default function ProductCard({ product, onProductUpdate }: Props) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.isAdmin;

  const cartItems = useAppSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => item.productId === product._id);

  // Local state for enhanced interactions
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await dispatch(
        addToCartThunk({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrl || '/placeholder.jpg',
          quantity: 1,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      setIsLoading(true);
      try {
        await dispatch(deleteProductThunk(product._id));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await dispatch(toggleActiveThunk(product._id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = () => {
    router.push(`/products/${product._id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: `${window.location.origin}/products/${product._id}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/products/${product._id}`
      );
      // You could add a toast notification here
    }
  };

  const calculateDiscountedPrice = () => {
    if (
      product.discountActive &&
      product.discountPercent &&
      product.discountPercent > 0
    ) {
      return product.price - (product.price * product.discountPercent) / 100;
    }
    return product.price;
  };

  const getStockStatus = () => {
    if (product.stock === 0)
      return { status: 'out', color: 'red', text: 'Out of Stock' };
    if (product.stock <= (product.restockThreshold || 5))
      return { status: 'low', color: 'yellow', text: 'Low Stock' };
    return { status: 'in', color: 'green', text: 'In Stock' };
  };

  const stockStatus = getStockStatus();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewProduct}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -8,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.3,
      }}
      className={`group relative w-full max-w-[280px] sm:max-w-[320px] rounded-xl bg-white border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
        !product.isActive ? 'opacity-60' : ''
      }`}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
        <Image
          src={(product.imageUrl || '/placeholder.jpg') as string}
          alt={
            typeof product.name === 'string' ? product.name : 'Product image'
          }
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />

        {/* Overlay with actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="flex gap-1.5 sm:gap-2">
                {!isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={isInCart || isLoading || product.stock === 0}
                    className={`p-2 sm:p-2.5 lg:p-3 rounded-full shadow-lg transition-all ${
                      isInCart
                        ? 'bg-green-500 text-white'
                        : 'bg-white/90 text-gray-700 hover:bg-white'
                    } ${isLoading ? 'animate-pulse' : ''}`}
                  >
                    {isInCart ? (
                      <Check
                        size={14}
                        className="sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                      />
                    ) : (
                      <ShoppingCart
                        size={14}
                        className="sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                      />
                    )}
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="p-2 sm:p-2.5 lg:p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg transition-all"
                >
                  <Share2 size={14} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Featured Badge */}
          {product.isFeatured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-yellow-200 flex items-center gap-1"
            >
              <Star size={10} className="sm:w-3" />
              Featured
            </motion.div>
          )}

          {/* Stock Status Badge */}
          {(stockStatus.status !== 'low' || isAdmin) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border flex items-center gap-1 ${
                stockStatus.color === 'red'
                  ? 'bg-red-500 border-red-200'
                  : stockStatus.color === 'yellow'
                    ? 'bg-yellow-500 border-yellow-200'
                    : 'bg-green-500 border-green-200'
              }`}
            >
              <Package size={10} className="sm:w-3" />
              {stockStatus.text}
            </motion.div>
          )}
        </div>

        {/* Discount Badge */}
        {product.discountActive &&
          product.discountPercent &&
          product.discountPercent > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-red-200 flex items-center gap-1"
            >
              <TrendingUp size={10} className="sm:w-3" />
              <span>-{product.discountPercent}%</span>
            </motion.div>
          )}

        {/* Admin Actions */}
        {isAdmin && (
          <div
            className="absolute top-2 right-2"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 sm:p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg transition-all"
            >
              <MoreVertical size={12} className="sm:w-4" />
            </motion.button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="absolute right-0 top-8 sm:top-10 bg-white rounded-lg shadow-xl border border-gray-200 p-2 space-y-1 min-w-[100px] sm:min-w-[120px]"
                >
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Pencil size={12} className="sm:w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={handleToggleActive}
                    className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-yellow-50 rounded-md transition-colors"
                  >
                    {product.isActive ? (
                      <EyeOff size={12} className="sm:w-3.5" />
                    ) : (
                      <Eye size={12} className="sm:w-3.5" />
                    )}
                    {product.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={12} className="sm:w-3.5" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-amber-600">
              {calculateDiscountedPrice().toFixed(2)}
            </span>
            {product.discountActive &&
              product.discountPercent &&
              product.discountPercent > 0 && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {product.price.toFixed(2)}
                </span>
              )}
          </div>

          {/* Promo Text */}
          {product.promoText && (
            <p className="text-xs text-green-600 font-medium truncate">
              {product.promoText}
            </p>
          )}
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Product Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Package size={12} />
            <span>Stock: {product.stock}</span>
          </div>
          {product.soldQuantity && product.soldQuantity > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp size={12} />
              <span>Sold: {product.soldQuantity}</span>
            </div>
          )}
          {product.views && product.views > 0 && (
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{product.views}</span>
            </div>
          )}
        </div>

        {/* Action Button for Users */}
        {!isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isInCart || isLoading || product.stock === 0}
            className={`w-full mt-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
              isInCart
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl'
            } ${isLoading ? 'animate-pulse' : ''}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isInCart ? (
              <>
                <Check size={16} className="sm:w-5" />
                Added to Cart
              </>
            ) : product.stock === 0 ? (
              <>
                <AlertCircle size={16} className="sm:w-5" />
                Out of Stock
              </>
            ) : (
              <>
                <ShoppingCart size={16} className="sm:w-5" />
                Add to Cart
              </>
            )}
          </motion.button>
        )}

        {/* Admin Status Indicator */}
        {isAdmin && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-xs text-gray-500">
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <span className="text-xs text-gray-400">{product.visibility}</span>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <EditProductModal
            product={product}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedProduct) => {
              setIsEditModalOpen(false);
              if (onProductUpdate) {
                onProductUpdate(updatedProduct as Product);
              }
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

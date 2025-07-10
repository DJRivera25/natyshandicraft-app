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
import { motion } from 'framer-motion';
import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Check,
} from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.isAdmin;

  const cartItems = useAppSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => item.productId === product._id);

  const handleAddToCart = async () => {
    await dispatch(
      addToCartThunk({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.jpg',
        quantity: 1,
      })
    );
  };

  const handleEdit = () => router.push(`/admin/product/${product._id}`);
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProductThunk(product._id));
    }
  };

  const handleToggleActive = async () => {
    await dispatch(toggleActiveThunk(product._id));
  };

  const handleViewProduct = () => {
    if (!isAdmin) router.push(`/products/${product._id}`);
  };

  return (
    <motion.div
      onClick={handleViewProduct}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className={`group mx-auto w-full max-w-[300px] rounded-3xl bg-white border border-amber-200 transition hover:shadow-2xl overflow-hidden relative ${
        !isAdmin ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative w-full h-52 bg-gradient-to-br from-amber-50 to-amber-100">
        <Image
          src={(product.imageUrl || '/placeholder.jpg') as string}
          alt={
            typeof product.name === 'string' ? product.name : 'Product image'
          }
          fill
          className="object-cover rounded-t-3xl"
        />
        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-200 z-10">
            🌟 Featured
          </span>
        )}
        {/* Discount badge */}
        {product.discountActive &&
          product.discountPercent &&
          product.discountPercent > 0 && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-red-200 text-white z-10">
              -{product.discountPercent}%
            </span>
          )}
      </div>

      <div className="p-5 space-y-2 flex flex-col min-h-[180px]">
        <h2 className="text-lg font-bold text-amber-900 line-clamp-2 mb-1">
          {product.name}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-xl font-extrabold text-amber-700">
            ₱{product.price.toFixed(2)}
          </p>
          {/* Show discounted price if applicable */}
          {product.discountActive &&
            product.discountPercent &&
            product.discountPercent > 0 && (
              <p className="text-base text-red-600 font-semibold line-through">
                ₱{product.price.toFixed(2)}
              </p>
            )}
        </div>
        {product.discountActive &&
          product.discountPercent &&
          product.discountPercent > 0 && (
            <p className="text-base text-green-600 font-bold">
              Discounted: ₱
              {(
                product.price -
                (product.price * product.discountPercent) / 100
              ).toFixed(2)}
            </p>
          )}
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        {/* Stock count with tooltip */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500" title="Stock available">
            🗃️ Stock: {product.stock}
          </span>
        </div>
        <div className="flex-1" />
        {!isAdmin ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isInCart) handleAddToCart();
            }}
            disabled={isInCart}
            className={`mt-4 w-full rounded-full px-4 py-2 text-base font-semibold flex items-center justify-center gap-2 transition duration-300 shadow-lg border-none ${
              isInCart
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {isInCart ? (
              <>
                <Check size={20} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={20} /> Add to Cart
              </>
            )}
          </button>
        ) : (
          <div className="mt-4 flex items-center justify-between text-gray-600">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="hover:text-blue-600"
              title="Edit"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="hover:text-red-600"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleActive();
              }}
              className="hover:text-yellow-600"
              title={product.isActive ? 'Mark Inactive' : 'Mark Active'}
            >
              {product.isActive ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

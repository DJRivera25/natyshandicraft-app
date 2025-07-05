'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import {
  deleteProductThunk,
  toggleStockThunk,
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
        image: product.imageUrl,
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

  const handleToggleStock = async () => {
    await dispatch(toggleStockThunk(product._id));
  };

  const handleViewProduct = () => {
    if (!isAdmin) router.push(`/products/${product._id}`);
  };

  return (
    <motion.div
      onClick={handleViewProduct}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 100, damping: 12 }}
      className={`group mx-auto w-full max-w-[280px] rounded-2xl bg-white border border-amber-200 transition hover:shadow-xl overflow-hidden ${
        !isAdmin ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative w-full h-48 bg-amber-50">
        <Image
          src={product.imageUrl ?? '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h2 className="text-base font-semibold text-amber-900 line-clamp-2">
          {product.name}
        </h2>
        <p className="text-lg font-bold text-amber-700">
          ₱{product.price.toFixed(2)}
        </p>

        {!isAdmin ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isInCart) handleAddToCart();
            }}
            disabled={isInCart}
            className={`mt-4 w-full rounded-full px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition duration-300 shadow ${
              isInCart
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {isInCart ? (
              <>
                <Check size={18} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={18} /> Add to Cart
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
              <Pencil size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="hover:text-red-600"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStock();
              }}
              className="hover:text-yellow-600"
              title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
            >
              {product.inStock ? (
                <XCircle size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

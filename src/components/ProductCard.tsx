'use client';

import { useAppDispatch } from '@/store/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import {
  deleteProductThunk,
  toggleStockThunk,
} from '@/features/product/productThunk';
import { addToCartThunk } from '@/features/cart/cartThunk';

interface Props {
  product: Product;
  onRefresh?: () => void;
}

export default function ProductCard({ product, onRefresh }: Props) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.isAdmin;

  const handleAddToCart = () => {
    dispatch(
      addToCartThunk({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
      })
    );
  };

  const handleEdit = () => {
    router.push(`/admin/product/${product._id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this product?'
    );
    if (!confirmDelete) return;

    await dispatch(deleteProductThunk(product._id));
    onRefresh?.(); // Refresh if provided
  };

  const handleToggleStock = async () => {
    await dispatch(toggleStockThunk(product._id));
    onRefresh?.(); // Refresh if provided
  };

  const handleViewProduct = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <div
      onClick={!isAdmin ? handleViewProduct : undefined}
      className={`rounded-xl border p-4 shadow-sm transition hover:shadow-lg ${
        !isAdmin ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
    >
      <img
        src={product.imageUrl ?? '/placeholder.jpg'}
        alt={product.name}
        className="mb-4 h-40 w-full rounded-md object-cover"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">₱{product.price.toFixed(2)}</p>

      {isAdmin && (
        <p
          className={`mt-1 inline-block rounded px-2 py-1 text-sm font-medium ${
            product.inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      )}

      {!isAdmin ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="mt-3 w-full rounded bg-violet-600 py-2 text-white hover:bg-violet-700"
        >
          Add to Cart
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <button
            onClick={handleEdit}
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="w-full rounded bg-red-600 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={handleToggleStock}
            className="w-full rounded bg-yellow-500 py-2 text-white hover:bg-yellow-600"
          >
            {product.inStock ? 'Mark as Out of Stock' : 'Mark as In Stock'}
          </button>
        </div>
      )}
    </div>
  );
}

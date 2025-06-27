'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProductByIdThunk,
  updateProductThunk,
  deleteProductThunk,
  toggleStockThunk,
} from '@/features/product/productThunk';
import EditProductModal from '@/components/EditProductModal';
import type { UpdateProductInput } from '@/types/product';

export default function ProductDetailsPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { selectedProduct, loading } = useAppSelector((state) => state.product);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') {
      dispatch(fetchProductByIdThunk(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    await dispatch(deleteProductThunk(id));
    router.push('/admin/products');
  };

  const handleToggleStock = async () => {
    await dispatch(toggleStockThunk(id));
    dispatch(fetchProductByIdThunk(id));
  };

  const handleSave = async (updated: UpdateProductInput) => {
    await dispatch(updateProductThunk(id, updated));
    dispatch(fetchProductByIdThunk(id));
    setShowModal(false);
  };

  if (loading || !selectedProduct)
    return <p className="p-6 text-center">Loading product...</p>;

  const {
    name,
    price,
    description,
    category,
    imageUrl,
    initialQuantity,
    inStock,
  } = selectedProduct;

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{name}</h1>
      <img
        src={imageUrl || '/placeholder.jpg'}
        alt={name}
        className="mb-6 w-full max-h-64 rounded object-cover"
      />
      <div className="space-y-2 text-lg">
        <p><strong>Price:</strong> ₱{price.toFixed(2)}</p>
        <p><strong>Description:</strong> {description || 'N/A'}</p>
        <p><strong>Category:</strong> {category || 'N/A'}</p>
        <p><strong>Initial Quantity:</strong> {initialQuantity}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`font-semibold ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Edit Product
        </button>
        <button
          onClick={handleToggleStock}
          className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        >
          {inStock ? 'Mark as Out of Stock' : 'Mark as In Stock'}
        </button>
        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Delete Product
        </button>
      </div>

      {showModal && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}

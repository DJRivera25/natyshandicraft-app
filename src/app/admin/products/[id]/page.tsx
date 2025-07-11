'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BreadCrumb from '@/components/BreadCrumb';
import EditProductModal from '@/components/EditProductModal';
import {
  apiFetchProductById,
  apiDeleteProduct,
  apiUpdateProduct,
  apiToggleProductActive,
} from '@/utils/api/products';
import type { Product, UpdateProductInput } from '@/types/product';

export default function ProductDetailsPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      setLoading(true);
      apiFetchProductById(id)
        .then(setProduct)
        .catch(() => setError('Failed to load product details.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await apiDeleteProduct(id);
    router.push('/admin/products');
  };

  const handleToggleStock = async () => {
    await apiToggleProductActive(id);
    const updated = await apiFetchProductById(id);
    setProduct(updated);
  };

  const handleSave = async (updated: UpdateProductInput) => {
    await apiUpdateProduct(id, updated);
    const refreshed = await apiFetchProductById(id);
    setProduct(refreshed);
    setShowModal(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-16">
      <BreadCrumb
        customLabels={{ admin: 'Admin', product: 'Products' }}
        currentTitle={product?.name || 'Product Details'}
        hideSegments={['[id]']}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/admin/products')}
          className="mb-6 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold px-4 py-2 rounded-full shadow"
        >
          ← Back to Products
        </button>
        {loading ? (
          <p className="p-6 text-center">Loading product...</p>
        ) : error ? (
          <p className="p-6 text-center text-red-500">{error}</p>
        ) : product ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                className="w-48 h-48 object-cover rounded-xl border border-amber-100 shadow"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-amber-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-amber-700 mb-2">
                  ₱{product.price.toFixed(2)}
                </p>
                <p className="text-sm text-amber-800 mb-2">
                  <strong>Category:</strong> {product.category || 'N/A'}
                </p>
                <p className="text-sm text-amber-800 mb-2">
                  <strong>Stock:</strong> {product.stock}
                </p>
                <p className="text-sm text-amber-800 mb-2">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${product.isActive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-base text-amber-900">
              <strong>Description:</strong>
              <div className="mt-1 text-amber-700 whitespace-pre-line">
                {product.description || 'No description provided.'}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() => setShowModal(true)}
                className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 font-semibold shadow"
              >
                Edit Product
              </button>
              <button
                onClick={handleToggleStock}
                className="rounded-full bg-yellow-500 px-5 py-2 text-white hover:bg-yellow-600 font-semibold shadow"
              >
                {product.isActive ? 'Mark as Inactive' : 'Mark as Active'}
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full bg-red-600 px-5 py-2 text-white hover:bg-red-700 font-semibold shadow"
              >
                Delete Product
              </button>
            </div>
            {showModal && (
              <EditProductModal
                product={product}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
              />
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}

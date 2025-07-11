'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BreadCrumb from '@/components/BreadCrumb';
import ProductDetails from '@/components/ProductDetails';
import EditProductModal from '@/components/EditProductModal';
import {
  apiFetchProductById,
  apiDeleteProduct,
  apiUpdateProduct,
  apiToggleProductActive,
} from '@/utils/api/products';
import type { Product, UpdateProductInput } from '@/types/product';
import { motion } from 'framer-motion';
import { AlertCircle, Package, ArrowLeft } from 'lucide-react';

export default function AdminProductDetailsPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
    if (
      !confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    )
      return;

    setActionLoading(true);
    try {
      await apiDeleteProduct(id);
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setActionLoading(true);
    try {
      await apiToggleProductActive(id);
      const updated = await apiFetchProductById(id);
      setProduct(updated);
    } catch (error) {
      console.error('Failed to toggle product status:', error);
      setError('Failed to update product status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async (
    updated: UpdateProductInput & { imageFile?: File | null }
  ) => {
    setActionLoading(true);
    try {
      await apiUpdateProduct(id, updated);
      const refreshed = await apiFetchProductById(id);
      setProduct(refreshed);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update product:', error);
      setError('Failed to update product. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Redirect if not admin
  if (session && !isAdmin) {
    router.push('/');
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md mx-auto">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/admin/products')}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md mx-auto">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Product not found
              </h3>
              <p className="text-gray-600 mb-4">
                The product you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <button
                onClick={() => router.push('/admin/products')}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BreadCrumb
          customLabels={{ admin: 'Admin', product: 'Products' }}
          currentTitle={product.name}
          hideSegments={['[id]']}
        />

        <div className="mt-6 mb-8">
          <button
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded-lg shadow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductDetails
            product={product}
            isAdmin={true}
            onEdit={() => setShowModal(true)}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </motion.div>

        {showModal && (
          <EditProductModal
            product={product}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}

        {actionLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-2"
              />
              <p className="text-gray-600 text-sm">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

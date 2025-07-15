'use client';
import { useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { updateProductThunk } from '@/features/product/productThunk';
import ProductDetails from './ProductDetails';
import EditProductModal from './EditProductModal';
import Breadcrumb from './BreadCrumb';
import { motion } from 'framer-motion';
import NewsletterOverlay from './NewsletterOverlay';
import Footer from './Footer';
import type { UpdateProductInput } from '@/types/product';
import type { Product as ProductType } from '@/types/product';
import { useToast } from './Toast';
import { AlertTriangle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Inject JSON-LD structured data for product
function ProductJsonLd({ product }: { product: ProductType }) {
  const url = `https://natyshandicraft-app.vercel.app/products/${product._id}`;
  const image = product.imageUrl || '/og-image.png';
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [image],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: "Naty's Handycrafts",
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PHP',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// DeleteProductModal (local, modeled after CancelOrderModal)
function DeleteProductModal({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-0 flex flex-col overflow-hidden"
            style={{ maxHeight: '100dvh' }}
          >
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-4 border-b border-red-200 flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-red-900">
                    Delete Product
                  </h2>
                  <p className="text-red-700 text-xs sm:text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none text-3xl md:text-2xl"
                aria-label="Close"
              >
                <span aria-hidden>×</span>
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
              <div className="flex items-start gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium mb-2">
                    Are you sure you want to delete{' '}
                    <span className="font-bold">{productName}</span>?
                  </p>
                  <p className="text-sm text-gray-600">
                    The product will be permanently deleted and cannot be
                    recovered.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  type="button"
                >
                  Keep Product
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  type="button"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Product'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProductDetailsClient({
  product,
}: {
  product: ProductType;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const { showToast } = useToast();

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  // Optionally, you can re-fetch product on mount if you want live updates
  // useEffect(() => {
  //   dispatch(fetchProductByIdThunk(product._id));
  // }, [dispatch, product._id]);

  // Admin handlers
  const handleEdit = useCallback(() => {
    setIsEditModalOpen(true);
    showToast('info', 'Edit product modal opened.');
  }, [showToast]);

  const handleDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete product');
      }
      showToast('success', 'Product deleted successfully!');
      router.push('/products');
    } catch (err: unknown) {
      let message = 'Failed to delete product';
      if (err instanceof Error) message = err.message;
      showToast('error', message);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }, [product._id, router, showToast]);

  const handleToggleActive = useCallback(async () => {
    setIsTogglingActive(true);
    try {
      const res = await fetch(
        `/api/products/${product._id}/toggle?field=isActive`,
        {
          method: 'PATCH',
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to toggle active status');
      }
      showToast('success', 'Product active status toggled.');
      // Optionally, you could re-fetch product data here
    } catch (err: unknown) {
      let message = 'Failed to toggle active status';
      if (err instanceof Error) message = err.message;
      showToast('error', message);
    } finally {
      setIsTogglingActive(false);
    }
  }, [product._id, showToast]);

  const handleProductUpdate = useCallback(
    (updatedProduct: UpdateProductInput & { imageFile?: File | null }) => {
      setIsEditModalOpen(false);
      // Update the product using the thunk
      dispatch(updateProductThunk(product._id, updatedProduct));
      showToast('success', 'Product updated successfully!');
    },
    [dispatch, product._id, showToast]
  );

  return (
    <>
      <Breadcrumb currentTitle={product.name} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pb-32">
          <ProductDetails
            product={product}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            isTogglingActive={isTogglingActive}
          />
        </div>
      </motion.div>
      {/* Newsletter Overlay */}
      <div className="relative">
        <NewsletterOverlay />
      </div>
      <div className="mt-[-48px]">
        <Footer />
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <EditProductModal
          product={product}
          onCloseAction={() => setIsEditModalOpen(false)}
          onSaveAction={handleProductUpdate}
        />
      )}
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        productName={product.name}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
      <Suspense fallback={null}>
        <ProductJsonLd product={product} />
      </Suspense>
    </>
  );
}

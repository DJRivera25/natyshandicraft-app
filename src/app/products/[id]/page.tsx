'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProductByIdThunk,
  updateProductThunk,
} from '@/features/product/productThunk';
import ProductDetails from '@/components/ProductDetails';
import EditProductModal from '@/components/EditProductModal';
import Breadcrumb from '@/components/BreadCrumb';
import { motion } from 'framer-motion';
import { AlertCircle, Package } from 'lucide-react';
import NewsletterOverlay from '@/components/NewsletterOverlay';
import Footer from '@/components/Footer';
import type { UpdateProductInput } from '@/types/product';
import { Suspense } from 'react';
import type { Product as ProductType } from '@/types/product';

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

export default function ProductDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.product
  );

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (params?.id) {
      dispatch(fetchProductByIdThunk(params.id));
    }
  }, [dispatch, params?.id]);

  // Admin handlers
  const handleEdit = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      // Handle delete logic here
      router.push('/products');
    }
  }, [router]);

  const handleToggleActive = useCallback(() => {
    // Handle toggle active logic here
    console.log('Toggle active');
  }, []);

  const handleProductUpdate = useCallback(
    (updatedProduct: UpdateProductInput & { imageFile?: File | null }) => {
      setIsEditModalOpen(false);
      // Update the product using the thunk
      if (params?.id) {
        dispatch(updateProductThunk(params.id, updatedProduct));
      }
    },
    [dispatch, params?.id]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Product not found
          </h3>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb currentTitle={selectedProduct.name} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pb-32">
          <ProductDetails
            product={selectedProduct}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
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
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProductUpdate}
        />
      )}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductJsonLd product={selectedProduct} />
        </Suspense>
      )}
    </>
  );
}

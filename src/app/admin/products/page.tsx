'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/addProductModal';
import { apiFetchAllProducts, apiDeleteProduct } from '@/utils/api/products';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    apiFetchAllProducts(1, 100) // Changed to use apiFetchAllProducts
      .then(({ products }) => {
        setProducts(products);
        setError(null);
      })
      .catch(() => setError('Failed to fetch products.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await apiDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-16">
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-amber-900">
            Manage Products
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-6 py-2 rounded-full shadow transition"
          >
            + Add Product
          </button>
        </div>
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-amber-100 animate-pulse h-60 rounded-3xl shadow-inner"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard product={product} />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() =>
                      router.push(`/admin/products/${product._id}`)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-3 py-1 text-xs font-semibold shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-3 py-1 text-xs font-semibold shadow"
                  >
                    Delete
                  </button>
                </div>
                {/* Status indicator for inactive products */}
                {!product.isActive && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-semibold shadow">
                    Inactive
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {isModalOpen && (
          <AddProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { apiFetchProducts } from '@/utils/api/products';
import { useHasMounted } from '@/utils/useHasMounted';
import type { Product } from '@/types/product';

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasMounted = useHasMounted();

  useEffect(() => {
    setLoading(true);
    apiFetchProducts(1, 4)
      .then(({ products }) => {
        setProducts(products);
        setError(null);
      })
      .catch(() => setError('Failed to fetch new arrivals.'))
      .finally(() => setLoading(false));
  }, []);

  if (!hasMounted) return null;

  return (
    <section className="w-full bg-gradient-to-b from-amber-50 to-white py-8 sm:py-10 lg:py-12 px-3 sm:px-4 flex justify-center">
      <div className="w-full max-w-[1300px]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-900 mb-1 sm:mb-2 text-center tracking-tight drop-shadow-sm">
          <span className="inline-block bg-amber-100 px-3 sm:px-4 py-1 rounded-full text-sm sm:text-base lg:text-lg">
            NEW ARRIVALS
          </span>
        </h2>
        <p className="text-center text-amber-700 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
          Discover the latest additions to our collection. Handpicked,
          high-quality, and ready to inspire your next find!
        </p>

        {loading ? (
          <div className="grid gap-4 sm:gap-5 lg:gap-7 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-amber-100 animate-pulse h-48 sm:h-56 lg:h-60 rounded-2xl sm:rounded-3xl shadow-inner"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No new arrivals found.</p>
        ) : (
          <div className="grid gap-4 sm:gap-5 lg:gap-7 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link href="/products">
            <button className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-bold px-8 sm:px-12 py-2.5 sm:py-3 rounded-full transition text-sm sm:text-base lg:text-lg shadow-lg">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

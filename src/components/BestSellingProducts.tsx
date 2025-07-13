'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { apiFetchProducts } from '@/utils/api/products';
import type { Product } from '@/types/product';

export default function BestSellingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetchProducts(1, 20)
      .then(({ products }) => {
        setProducts(products);
        setError(null);
      })
      .catch(() => setError('Failed to fetch best sellers.'))
      .finally(() => setLoading(false));
  }, []);

  const bestSelling = products
    .slice()
    .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
    .slice(0, 4);

  return (
    <section className="w-full bg-gradient-to-b from-amber-100 to-white py-8 sm:py-10 lg:py-12 px-3 sm:px-4 flex justify-center">
      <div className="w-full max-w-[1300px]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-800 mb-1 sm:mb-2 text-center tracking-tight drop-shadow-sm">
          <span className="inline-block bg-amber-200 px-3 sm:px-4 py-1 rounded-full text-sm sm:text-base lg:text-lg">
            BEST SELLERS
          </span>
        </h2>
        <p className="text-center text-amber-700 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
          Our most popular products, loved by our customers.
        </p>
        {loading ? (
          <div className="grid gap-4 sm:gap-5 lg:gap-7 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-amber-200 animate-pulse h-48 sm:h-56 lg:h-60 rounded-2xl sm:rounded-3xl shadow-inner"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : bestSelling.length === 0 ? (
          <p className="text-center text-gray-500">No best sellers found.</p>
        ) : (
          <div className="grid gap-4 sm:gap-5 lg:gap-7 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {bestSelling.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

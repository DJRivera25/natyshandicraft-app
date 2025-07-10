'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { apiFetchProducts } from '@/utils/api/products';
import type { Product } from '@/types/product';

export default function FeaturedProducts() {
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
      .catch(() => setError('Failed to fetch featured products.'))
      .finally(() => setLoading(false));
  }, []);

  const featured = products
    .filter((p) => p.isFeatured)
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 4);

  return (
    <section className="w-full bg-gradient-to-b from-yellow-50 to-white py-12 px-4 flex justify-center">
      <div className="w-full max-w-[1300px]">
        <h2 className="text-4xl font-extrabold text-yellow-700 mb-2 text-center tracking-tight drop-shadow-sm">
          <span className="inline-block bg-yellow-100 px-4 py-1 rounded-full">
            FEATURED PRODUCTS
          </span>
        </h2>
        <p className="text-center text-yellow-700 mb-8 text-lg max-w-2xl mx-auto">
          Our handpicked featured products, chosen for their quality and
          popularity.
        </p>
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-yellow-100 animate-pulse h-60 rounded-3xl shadow-inner"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : featured.length === 0 ? (
          <p className="text-center text-gray-500">
            No featured products found.
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

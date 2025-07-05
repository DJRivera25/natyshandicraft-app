'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductsThunk } from '@/features/product/productThunk';
import ProductCard from './ProductCard';

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProductsThunk(1, 4));
  }, [dispatch]);

  return (
    <section className="w-full bg-white py-10 px-4 flex justify-center">
      <div className="w-full max-w-[1300px]">
        <h2 className="text-3xl sm:text-3xl font-bold text-amber-900 mb-6 text-center">
          <strong>NEW ARRIVALS</strong>
        </h2>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-amber-100 animate-pulse h-48 rounded-md"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No new arrivals found.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-8 text-center">
          <Link href="/products">
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-10 py-2 rounded-full transition">
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

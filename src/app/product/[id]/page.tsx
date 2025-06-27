'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductByIdThunk } from '@/features/product/productThunk';
import AddToCartClient from '@/components/AddToCartClient';

export default function ProductDetailPage() {
  const params = useParams() as { id: string };
  const dispatch = useAppDispatch();

  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (params?.id) {
      dispatch(fetchProductByIdThunk(params.id));
    }
  }, [dispatch, params?.id]);

  if (loading || !selectedProduct)
    return <p className="p-6 text-center">Loading product...</p>;

  if (error)
    return (
      <p className="p-6 text-center text-red-600">
        Failed to load product: {error}
      </p>
    );

  const { _id, name, price, imageUrl, category, description } = selectedProduct;

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <img
            src={imageUrl || '/placeholder.jpg'}
            alt={name}
            className="w-full rounded-xl object-cover"
          />
        </div>
        <div>
          <h1 className="mb-2 text-3xl font-bold">{name}</h1>
          <p className="mb-4 text-xl text-violet-700">₱{price.toFixed(2)}</p>
          <p className="mb-2 text-gray-600">
            Category: <span className="font-medium">{category}</span>
          </p>
          <p className="mb-6 text-gray-700">{description}</p>

          <AddToCartClient
            product={{
              _id,
              name,
              price,
              imageUrl: imageUrl ?? '/placeholder.jpg',
            }}
          />
        </div>
      </div>
    </main>
  );
}

'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductByIdThunk } from '@/features/product/productThunk';
import AddToCartClient from '@/components/AddToCartClient';
import PageWrapper from '@/components/PageWrapper';
import Breadcrumb from '@/components/BreadCrumb';

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

  if (loading) return null;

  if (error)
    return (
      <PageWrapper>
        <p
          className="p-6 text-center text-red-700 font-semibold"
          role="alert"
          aria-live="assertive"
        >
          Failed to load product: {error}
        </p>
      </PageWrapper>
    );

  if (!selectedProduct)
    return (
      <PageWrapper>
        <p className="p-6 text-center text-gray-600 italic" aria-live="polite">
          Product not found.
        </p>
      </PageWrapper>
    );

  const { _id, name, price, imageUrl, category, description } = selectedProduct;

  return (
    <PageWrapper>
      <Breadcrumb currentTitle={name} />
      <article className="mx-auto max-w-5xl px-2 sm:px-4 py-6 md:py-12 rounded-3xl bg-amber-100 shadow-lg">
        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden">
          {/* Image Section */}
          <div className="flex items-center justify-center p-4  md:w-1/2">
            <Image
              src={imageUrl || '/placeholder.jpg'}
              alt={`Image of ${name}`}
              width={400}
              height={400}
              className="rounded-xl object-contain max-h-[400px] w-auto h-auto"
              placeholder="blur"
              blurDataURL="/placeholder-blur.png"
              priority
            />
          </div>

          {/* Info Section */}
          <section className="flex flex-col justify-between p-8 md:w-1/2">
            <div>
              <h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">
                {name}
              </h1>
              <p className="text-2xl font-semibold text-amber-700 mb-4">
                ₱{price.toFixed(2)}
              </p>
              <span className="inline-block mb-6 px-3 py-1 text-sm font-medium bg-amber-200 text-amber-900 rounded-full uppercase tracking-wider">
                {category}
              </span>
              <p className="text-amber-800 leading-relaxed whitespace-pre-line mb-10">
                {description}
              </p>
            </div>

            <AddToCartClient
              product={{
                _id,
                name,
                price,
                imageUrl: imageUrl ?? '/placeholder.jpg',
              }}
            />
          </section>
        </div>
      </article>
    </PageWrapper>
  );
}

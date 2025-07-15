import { Product } from '@/models/Product';
import { connectDB } from '@/lib/db';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { notFound } from 'next/navigation';
import type { Product as ProductType } from '@/types/product';

export default async function ProductDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  await connectDB();
  const product = await Product.findById(params.id).lean<ProductType | null>();
  if (!product) return notFound();
  const plainProduct = JSON.parse(JSON.stringify(product));
  return <ProductDetailsClient product={plainProduct} />;
}

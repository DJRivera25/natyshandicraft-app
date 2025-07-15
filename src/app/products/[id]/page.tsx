import { Product } from '@/models/Product';
import { connectDB } from '@/lib/db';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { notFound } from 'next/navigation';
import type { Product as ProductType } from '@/types/product';

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const product = await Product.findById(params.id).lean<ProductType | null>();
  if (!product) return notFound();
  const plainProduct = JSON.parse(JSON.stringify(product));
  return <ProductDetailsClient product={plainProduct} />;
}

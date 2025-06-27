// pages/api/products/[id]/toggle-stock.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { id } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.inStock = !product.inStock;
    await product.save();

    return res.status(200).json({ message: 'Stock status toggled' });
  } catch (error) {
    const err = error as Error;
    return res
      .status(400)
      .json({ message: 'Failed to toggle stock status', error: err.message });
  }
}

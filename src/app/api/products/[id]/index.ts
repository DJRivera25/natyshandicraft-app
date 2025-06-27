// pages/api/products/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    if (req.method === 'GET') {
      const product = await Product.findById(id);
      if (!product)
        return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(product);
    }

    if (req.method === 'PUT') {
      const updated = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated)
        return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json({ message: 'Product deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
}

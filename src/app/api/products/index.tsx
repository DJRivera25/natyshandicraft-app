// pages/api/products/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const products = await Product.find();
      return res.status(200).json(products);
    } catch (error) {
      const err = error as Error;
      return res
        .status(500)
        .json({ message: 'Failed to fetch products', error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const newProduct = await Product.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error) {
      const err = error as Error;
      return res
        .status(400)
        .json({ message: 'Failed to create product', error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import redis from '@/lib/redis';

export async function GET() {
  try {
    await connectDB();

    const cacheKey = 'categories';
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), { status: 200 });
    }

    const categories = await Product.distinct('category');
    await redis.set(cacheKey, JSON.stringify(categories), 'EX', 600);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('[GET /api/products/categories]', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import redis from '@/lib/redis';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const skip = (page - 1) * limit;

    // Redis cache key based on page and limit
    const cacheKey = `products:all:page:${page}:limit:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // For admin: show ALL products (including inactive) but exclude deleted ones
    const [products, total] = await Promise.all([
      Product.find({ deletedAt: null }) // Removed isActive: true filter
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ deletedAt: null }), // Removed isActive: true filter
    ]);

    const enhancedProducts = products.map((p) => ({
      ...p,
      discountedPrice:
        p.discountActive && p.discountPercent
          ? p.price - (p.price * p.discountPercent) / 100
          : p.price,
    }));

    const response = {
      products: enhancedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    // Cache the response for 60 seconds
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 60);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products', error: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import redis from '@/lib/redis';

// Helper to check for invalid numbers
const isInvalidNumber = (value: unknown): boolean => {
  return typeof value !== 'number' || Number.isNaN(value);
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const skip = (page - 1) * limit;

    // Redis cache key based on page and limit
    const cacheKey = `products:page:${page}:limit:${limit}`;
    const start = Date.now();
    const cached = await redis.get(cacheKey);
    const redisGetTime = Date.now() - start;
    if (cached) {
      console.log('CACHE HIT:', cacheKey);
      console.log('Redis GET took', redisGetTime, 'ms');
      console.log('Cached data size:', cached.length, 'bytes');
      const parseStart = Date.now();
      const parsed = JSON.parse(cached);
      const parseTime = Date.now() - parseStart;
      console.log('JSON.parse took', parseTime, 'ms');
      return NextResponse.json(parsed);
    }
    console.log('CACHE MISS:', cacheKey);

    const [products, total] = await Promise.all([
      Product.find({ deletedAt: null, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ deletedAt: null, isActive: true }),
    ]);

    const enhancedProducts = products.map((p) => ({
      ...p,
      discountedPrice:
        p.discountActive && p.discountPercent
          ? p.price - (p.price * p.discountPercent) / 100
          : p.price,
    }));

    if (enhancedProducts.length > 0) {
      console.log(
        'Sample product size:',
        JSON.stringify(enhancedProducts[0]).length,
        'bytes'
      );
      console.log('Sample product keys:', Object.keys(enhancedProducts[0]));
      Object.entries(enhancedProducts[0]).forEach(([key, value]) => {
        console.log(`${key}: ${JSON.stringify(value).length} bytes`);
      });
    }

    enhancedProducts.forEach((product, idx) => {
      const size = JSON.stringify(product).length;
      if (size > 2000) {
        // Arbitrary threshold for 'large' product
        console.log(
          `Product at index ${idx} is unusually large: ${size} bytes`,
          product
        );
      } else {
        console.log(`Product at index ${idx} size: ${size} bytes`);
      }
    });

    const response = {
      products: enhancedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    console.log('Response size:', JSON.stringify(response).length, 'bytes');
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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const body: Record<string, unknown> = await request.json();

    // Only require essentials
    const { name, price, stock, imageUrl } = body;
    if (
      typeof name !== 'string' ||
      typeof imageUrl !== 'string' ||
      isInvalidNumber(price) ||
      isInvalidNumber(stock)
    ) {
      return NextResponse.json(
        {
          message:
            'Missing or invalid required fields: name (string), imageUrl (string), price (number), stock (number)',
        },
        { status: 400 }
      );
    }

    // Pass all provided fields to Product.create
    const newProduct = await Product.create({ ...body });

    // Invalidate relevant Redis caches
    await redis.del('categories');
    const listKeys = await redis.keys('products:page:*');
    if (listKeys.length) await redis.del(...listKeys);
    const allKeys = await redis.keys('products:all:page:*');
    if (allKeys.length) await redis.del(...allKeys);
    const searchKeys = await redis.keys('search:*');
    if (searchKeys.length) await redis.del(...searchKeys);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create product', error: (error as Error).message },
      { status: 400 }
    );
  }
}

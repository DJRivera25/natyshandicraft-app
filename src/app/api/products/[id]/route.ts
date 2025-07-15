// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import redis from '@/lib/redis';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();

  const { id } = params;
  const cacheKey = `product:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached), { status: 200 });
  }

  if (!id) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    await redis.set(cacheKey, JSON.stringify(product), 'EX', 60);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();

  const { id } = params;
  const body = await request.json();

  try {
    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Invalidate relevant Redis caches
    await redis.del(`product:${id}`);
    await redis.del('categories');
    const listKeys = await redis.keys('products:page:*');
    if (listKeys.length) await redis.del(...listKeys);
    const allKeys = await redis.keys('products:all:page:*');
    if (allKeys.length) await redis.del(...allKeys);
    const searchKeys = await redis.keys('search:*');
    if (searchKeys.length) await redis.del(...searchKeys);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();

  const { id } = params;

  try {
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Invalidate relevant Redis caches
    await redis.del(`product:${id}`);
    await redis.del('categories');
    const listKeys = await redis.keys('products:page:*');
    if (listKeys.length) await redis.del(...listKeys);
    const allKeys = await redis.keys('products:all:page:*');
    if (allKeys.length) await redis.del(...allKeys);
    const searchKeys = await redis.keys('search:*');
    if (searchKeys.length) await redis.del(...searchKeys);

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}

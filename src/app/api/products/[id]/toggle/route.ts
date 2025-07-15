import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import redis from '@/lib/redis';

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const params = await props.params;
  try {
    await connectDB();
    const { id } = params;
    const toggle = req.nextUrl.searchParams.get('field'); // ?field=isActive

    const validFields = [
      'isActive',
      'discountActive',
      'isFeatured',
      'visibility',
      'deleted',
    ];

    if (!toggle || !validFields.includes(toggle)) {
      return NextResponse.json(
        { message: `Invalid toggle field. Allowed: ${validFields.join(', ')}` },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    switch (toggle) {
      case 'deleted':
        product.deletedAt = product.deletedAt ? null : new Date();
        break;
      case 'visibility':
        product.visibility =
          product.visibility === 'public' ? 'private' : 'public';
        break;
      default:
        // isActive, discountActive, isFeatured
        product[toggle] = !product[toggle];
        break;
    }

    await product.save();

    // Invalidate relevant Redis caches
    await redis.del(`product:${product._id}`);
    await redis.del('categories');
    // Invalidate all product list and search caches (wildcard)
    const listKeys = await redis.keys('products:page:*');
    if (listKeys.length) await redis.del(...listKeys);
    const allKeys = await redis.keys('products:all:page:*');
    if (allKeys.length) await redis.del(...allKeys);
    const searchKeys = await redis.keys('search:*');
    if (searchKeys.length) await redis.del(...searchKeys);

    return NextResponse.json(
      { message: `${toggle} toggled.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to toggle field', error: (error as Error).message },
      { status: 400 }
    );
  }
}

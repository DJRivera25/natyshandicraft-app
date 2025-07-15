import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product, IProduct, IReview } from '@/models/Product';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';
import redis from '@/lib/redis';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();
  const productId = params.id;
  const cacheKey = `reviews:product:${productId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }
  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }
  const product = await Product.findById(productId)
    .select('reviews')
    .populate('reviews.user', 'fullName email')
    .lean<IProduct | null>();
  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce(
          (sum, r) => sum + (typeof r.rating === 'number' ? r.rating : 0),
          0
        ) / reviewCount
      : 0;
  const response = {
    reviews,
    reviewCount,
    averageRating: Math.round(averageRating * 100) / 100,
  };
  await redis.set(cacheKey, JSON.stringify(response), 'EX', 60);
  return NextResponse.json(response);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const productId = params.id;
  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }
  const body = await req.json();
  const { rating, comment } = body;
  if (
    !rating ||
    !comment ||
    typeof rating !== 'number' ||
    typeof comment !== 'string'
  ) {
    return NextResponse.json(
      { message: 'Invalid review data' },
      { status: 400 }
    );
  }
  // Check if user purchased this product
  const hasPurchased = await Order.exists({
    user: userId,
    'items.product': productId,
    status: { $in: ['paid', 'completed'] },
  });
  if (!hasPurchased) {
    return NextResponse.json(
      { message: 'You must purchase this product to review.' },
      { status: 403 }
    );
  }
  // Prevent duplicate review
  const product = (await Product.findById(productId)) as IProduct | null;
  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  if (product.reviews.some((r: IReview) => r.user.toString() === userId)) {
    return NextResponse.json(
      { message: 'You have already reviewed this product.' },
      { status: 409 }
    );
  }
  // Add review
  product.reviews.push({
    user: new Types.ObjectId(userId),
    rating,
    comment,
    createdAt: new Date(),
  } as IReview);
  await product.save();
  return NextResponse.json({ message: 'Review added successfully.' });
}

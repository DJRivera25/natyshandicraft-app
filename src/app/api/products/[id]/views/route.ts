import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { Types } from 'mongoose';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();

  const productId = params.id;

  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    // Use findByIdAndUpdate with $inc to atomically increment views
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'View count incremented successfully',
      views: updatedProduct.views,
    });
  } catch (error) {
    console.error('❌ Failed to increment product views:', error);
    return NextResponse.json(
      { message: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}

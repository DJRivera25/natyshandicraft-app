import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { Types } from 'mongoose';

export async function PATCH(
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
    const body = await req.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { message: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    // Use findByIdAndUpdate with $inc to atomically increment sold quantity
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: {
          soldQuantity: quantity,
          stock: -quantity,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Sold quantity updated successfully',
      soldQuantity: updatedProduct.soldQuantity,
      stock: updatedProduct.stock,
    });
  } catch (error) {
    console.error('❌ Failed to update sold quantity:', error);
    return NextResponse.json(
      { message: 'Failed to update sold quantity' },
      { status: 500 }
    );
  }
}

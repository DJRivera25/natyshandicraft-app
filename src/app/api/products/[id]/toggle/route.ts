import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

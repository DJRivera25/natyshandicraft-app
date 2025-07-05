import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET() {
  try {
    await connectDB();

    const categories = await Product.distinct('category');

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('[GET /api/products/categories]', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

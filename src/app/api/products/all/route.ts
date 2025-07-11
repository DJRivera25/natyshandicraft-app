import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const skip = (page - 1) * limit;

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

    return NextResponse.json({
      products: enhancedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products', error: (error as Error).message },
      { status: 500 }
    );
  }
}

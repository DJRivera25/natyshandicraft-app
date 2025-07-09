import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

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

export async function POST(request: Request) {
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
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create product', error: (error as Error).message },
      { status: 400 }
    );
  }
}

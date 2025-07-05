import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

interface ProductFilter {
  name?: { $regex: string; $options: string };
  price?: { $gte?: number; $lte?: number };
  category?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectDB(); // ✅ DB connection
  const { searchParams } = new URL(req.url);

  // ✅ Read query params with fallback
  const query = searchParams.get('q')?.trim() ?? '';
  const minPrice = parseFloat(searchParams.get('minPrice') ?? '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') ?? '0');
  const category = searchParams.get('category')?.trim() ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const sortBy = searchParams.get('sortBy') ?? 'newest';

  // ✅ Construct MongoDB filter object
  const filters: ProductFilter = {};
  let sort: Record<string, 1 | -1> = { createdAt: -1 }; // default sort by newest

  if (query) {
    filters.name = { $regex: query, $options: 'i' };
  }

  // 🔍 Only apply price filters if they are valid
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    filters.price = {};
    if (!isNaN(minPrice)) filters.price.$gte = minPrice;
    if (!isNaN(maxPrice) && maxPrice > 0) filters.price.$lte = maxPrice;
  }

  if (category) {
    filters.category = category;
  }

  // ✅ Sort by value
  if (sortBy === 'priceAsc') sort = { price: 1 };
  if (sortBy === 'priceDesc') sort = { price: -1 };

  try {
    const total = await Product.countDocuments(filters); // total for pagination

    // 🚀 FIXED: pagination logic
    const skip = (page - 1) * limit;

    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

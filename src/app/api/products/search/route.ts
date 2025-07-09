import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';

interface ProductFilter {
  deletedAt?: null;
  isActive?: boolean;
  name?: { $regex: string; $options: string };
  price?: { $gte?: number; $lte?: number };
  category?: string;
  tags?: { $in: string[] };
  isFeatured?: boolean;
  discountActive?: boolean;
  stock?: { $gt?: number };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const query = searchParams.get('q')?.trim() ?? '';
  const minPrice = parseFloat(searchParams.get('minPrice') ?? '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') ?? '0');
  const category = searchParams.get('category')?.trim() ?? '';
  const tag = searchParams.get('tag')?.trim() ?? '';
  const featured = searchParams.get('isFeatured');
  const inStock = searchParams.get('inStock');
  const discount = searchParams.get('discount');
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const sortBy = searchParams.get('sortBy') ?? 'newest';

  const filters: ProductFilter = {
    deletedAt: null,
    isActive: true,
  };

  // 🔍 Search by name
  if (query) {
    filters.name = { $regex: query, $options: 'i' };
  }

  // 🔢 Price range
  if (!isNaN(minPrice) || !isNaN(maxPrice)) {
    filters.price = {};
    if (!isNaN(minPrice)) filters.price.$gte = minPrice;
    if (!isNaN(maxPrice) && maxPrice > 0) filters.price.$lte = maxPrice;
  }

  // 📁 Category
  if (category) {
    filters.category = category;
  }

  // 🏷 Tags
  if (tag) {
    filters.tags = { $in: [tag] };
  }

  // 🌟 Featured only
  if (featured === 'true') {
    filters.isFeatured = true;
  }

  // ✅ In-stock only
  if (inStock === 'true') {
    filters.stock = { $gt: 0 };
  }

  // 💸 Discounted only
  if (discount === 'true') {
    filters.discountActive = true;
  }

  // 🔁 Sorting
  let sort: Record<string, 1 | -1> = { createdAt: -1 };
  switch (sortBy) {
    case 'priceAsc':
      sort = { price: 1 };
      break;
    case 'priceDesc':
      sort = { price: -1 };
      break;
    case 'rating':
      sort = { averageRating: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    default:
      sort = { createdAt: -1 }; // newest
  }

  try {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filters).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filters),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}

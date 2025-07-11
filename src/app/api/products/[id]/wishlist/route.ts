import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
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

  try {
    const body = await req.json();
    const { action } = body; // 'add' or 'remove'

    if (!action || !['add', 'remove'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action. Must be "add" or "remove"' },
        { status: 400 }
      );
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    let isWishlisted = false;
    let updatedWishlistCount = product.wishlistCount;

    if (action === 'add') {
      // Add to wishlist if not already there
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        product.wishlistCount += 1;
        updatedWishlistCount = product.wishlistCount;
        isWishlisted = true;
      }
    } else if (action === 'remove') {
      // Remove from wishlist if present
      const index = user.wishlist.indexOf(productId);
      if (index > -1) {
        user.wishlist.splice(index, 1);
        product.wishlistCount = Math.max(0, product.wishlistCount - 1);
        updatedWishlistCount = product.wishlistCount;
        isWishlisted = false;
      }
    }

    // Save both user and product
    await Promise.all([user.save(), product.save()]);

    return NextResponse.json({
      message: `Product ${action === 'add' ? 'added to' : 'removed from'} wishlist successfully`,
      isWishlisted,
      wishlistCount: updatedWishlistCount,
    });
  } catch (error) {
    console.error('❌ Wishlist operation failed:', error);
    return NextResponse.json(
      { message: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ isWishlisted: false }, { status: 200 });
  }

  const userId = session.user.id;
  const productId = params.id;

  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId);
    if (!user || !user.wishlist) {
      return NextResponse.json({ isWishlisted: false }, { status: 200 });
    }

    const isWishlisted = user.wishlist.includes(productId);

    return NextResponse.json({ isWishlisted }, { status: 200 });
  } catch (error) {
    console.error('❌ Failed to check wishlist status:', error);
    return NextResponse.json(
      { message: 'Failed to check wishlist status' },
      { status: 500 }
    );
  }
}

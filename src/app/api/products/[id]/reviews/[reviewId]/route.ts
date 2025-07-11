import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product, IProduct } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const isAdmin = session.user.isAdmin;
  const productId = params.id;
  // reviewId param is now ignored; we use userId instead
  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }
  const product = (await Product.findById(productId)) as IProduct | null;
  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  const reviewIndex = product.reviews.findIndex(
    (r) => r.user.toString() === userId
  );
  if (reviewIndex === -1) {
    return NextResponse.json({ message: 'Review not found' }, { status: 404 });
  }
  // Only review owner or admin can delete
  if (!isAdmin && product.reviews[reviewIndex].user.toString() !== userId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  product.reviews.splice(reviewIndex, 1);
  await product.save();
  return NextResponse.json({ message: 'Review deleted successfully.' });
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ hasPurchased: false }, { status: 200 });
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
    // Check if user has purchased this product (paid or completed orders)
    const hasPurchased = await Order.exists({
      user: userId,
      'items.product': productId,
      status: { $in: ['paid', 'completed'] },
    });

    return NextResponse.json({ hasPurchased: !!hasPurchased }, { status: 200 });
  } catch (error) {
    console.error('❌ Purchase verification failed:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

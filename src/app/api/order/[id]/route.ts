import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';

// ✅ Use official App Router type for context
export async function GET(
  req: NextRequest,
  context: { params: Record<'id', string> } // ✅ THIS IS THE VALID TYPE
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const orderId = context.params.id;

  if (!Types.ObjectId.isValid(orderId)) {
    return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
  }

  try {
    const order = await Order.findById(orderId).populate(
      'user',
      'fullName email'
    );

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const isAdmin = session.user.isAdmin;
    if (!isAdmin && String(order.user._id) !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('❌ Failed to fetch order by ID:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

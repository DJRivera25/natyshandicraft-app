import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';

// ✅ Use official App Router type for context
export async function GET(
  req: NextRequest,
  context: { params: Promise<Record<'id', string>> } // ✅ THIS IS THE VALID TYPE
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const orderId = (await context.params).id;

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

// ✅ Cancel order endpoint
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<Record<'id', string>> }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const orderId = (await context.params).id;

  if (!Types.ObjectId.isValid(orderId)) {
    return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action !== 'cancel') {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Check if user owns the order or is admin
    const isAdmin = session.user.isAdmin;
    if (!isAdmin && String(order.user) !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if order can be cancelled
    if (order.status === 'cancelled') {
      return NextResponse.json(
        { message: 'Order is already cancelled' },
        { status: 400 }
      );
    }

    if (order.status === 'paid') {
      return NextResponse.json(
        { message: 'Cannot cancel paid orders' },
        { status: 400 }
      );
    }

    // Allow cancellation of pending orders regardless of payment method
    if (order.status !== 'pending') {
      return NextResponse.json(
        { message: 'Only pending orders can be cancelled' },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    return NextResponse.json(
      {
        message: 'Order cancelled successfully',
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Failed to cancel order:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

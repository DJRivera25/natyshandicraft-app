import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';

interface OrderQuery {
  status?: string;
  $or?: Array<Record<string, unknown>>;
}

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const query: OrderQuery = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { 'address.city': { $regex: search, $options: 'i' } },
      { paymentMethod: { $regex: search, $options: 'i' } },
      { _id: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'fullName email');

  return NextResponse.json({ orders, total, page, limit });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { orderId, status } = await req.json();
  if (!orderId || !status) {
    return NextResponse.json(
      { message: 'Missing orderId or status' },
      { status: 400 }
    );
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }

  order.status = status;
  if (status === 'paid') order.paidAt = new Date();
  if (status === 'cancelled') order.cancelledAt = new Date();
  await order.save();

  return NextResponse.json({ order });
}

// src/app/api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // adjust path to your auth options
import { Types } from 'mongoose';

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { items }: { items: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }[] } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'No items in order' }, { status: 400 });
    }

    // Build order items
    const orderItems = items.map(item => ({
      product: new Types.ObjectId(item.productId),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: new Types.ObjectId(session.user.id), // or session.user.id depending on how you store it
      items: orderItems,
      status: 'pending',
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error('❌ Order creation failed:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }

  
}

export async function GET() {
    await connectDB();
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const isAdmin = session.user.isAdmin;
  
      const orders = await Order.find(
        isAdmin ? {} : { user: session.user.id }
      )
        .populate('user', 'fullName email') // optional: include user details
        .sort({ createdAt: -1 });
  
      return NextResponse.json(orders, { status: 200 });
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
      return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
  }
  



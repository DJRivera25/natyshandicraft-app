import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { items, totalAmount, paymentMethod, status, address } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'No items in order' },
        { status: 400 }
      );
    }

    if (
      !address ||
      !address.street ||
      !address.brgy ||
      !address.city ||
      !address.province ||
      !address.postalCode
    ) {
      return NextResponse.json(
        { message: 'Invalid or incomplete address' },
        { status: 400 }
      );
    }

    // Build order items
    const orderItems = items.map((item) => ({
      product: new Types.ObjectId(item.productId),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: new Types.ObjectId(session.user.id),
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      status: status || 'pending',
      address,
    });

    // 🆕 Update product sold quantities for COD orders immediately
    if (paymentMethod === 'cod') {
      try {
        // Update sold quantities for all products in the order
        const updatePromises = orderItems.map(async (item) => {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: {
                soldQuantity: item.quantity,
                stock: -item.quantity, // Also decrease stock
              },
            },
            { new: true, runValidators: true }
          );
        });

        await Promise.all(updatePromises);
        console.log(
          `[Order Creation] Updated sold quantities for ${orderItems.length} products in COD order ${order._id}`
        );
      } catch (error) {
        console.error(
          '[Order Creation] Failed to update product sold quantities:',
          error
        );
        // Don't fail the order creation if product updates fail
      }
    }

    const cart = await Cart.findOne({ user: session.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

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

    const orders = await Order.find(isAdmin ? {} : { user: session.user.id })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('❌ Failed to fetch orders:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

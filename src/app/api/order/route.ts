import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/models/Order';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Types } from 'mongoose';
import { createNotification } from '@/lib/createNotification';

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { items, totalAmount, paymentMethod, status, address, location } =
      body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'No items in order' },
        { status: 400 }
      );
    }

    if (
      !address ||
      !address.street ||
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

    // Prepare order data with location
    const orderData: {
      user: Types.ObjectId;
      items: typeof orderItems;
      totalAmount: number;
      paymentMethod: string;
      status: string;
      address: typeof address;
      location?: {
        lat: number;
        lng: number;
        formattedAddress?: string;
      };
    } = {
      user: new Types.ObjectId(session.user.id),
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      status: status || 'pending',
      address,
    };

    // Add location data if provided
    if (location && location.lat && location.lng) {
      orderData.location = {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: location.formattedAddress,
      };
    }

    const order = await Order.create(orderData);

    // 🆕 Update product sold quantities for COD orders immediately
    if (paymentMethod === 'cod') {
      try {
        // Update sold quantities for all products in the order
        const updatePromises = orderItems.map(async (item) => {
          const updatedProduct = await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: {
                soldQuantity: item.quantity,
                stock: -item.quantity, // Also decrease stock
              },
            },
            { new: true, runValidators: true }
          );

          // Out of stock / low stock notifications
          if (updatedProduct) {
            if (updatedProduct.stock === 0) {
              await createNotification({
                type: 'out_of_stock',
                message: `Product "${updatedProduct.name}" is now out of stock.`,
                meta: {
                  productId: updatedProduct._id,
                  name: updatedProduct.name,
                  stock: updatedProduct.stock,
                },
              });
            } else if (updatedProduct.stock > 0 && updatedProduct.stock <= 5) {
              await createNotification({
                type: 'low_stock',
                message: `Product "${updatedProduct.name}" is low on stock (${updatedProduct.stock} left).`,
                meta: {
                  productId: updatedProduct._id,
                  name: updatedProduct.name,
                  stock: updatedProduct.stock,
                },
              });
            }
          }
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

    // 🟢 Create admin notification for new order
    try {
      await createNotification({
        type: 'order_checkout',
        message: `New order placed by ${session.user.name || session.user.email} (Order #${order._id})`,
        meta: {
          orderId: order._id,
          userId: session.user.id,
          totalAmount: order.totalAmount,
        },
      });
    } catch (err) {
      console.error('Failed to create admin notification for new order:', err);
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

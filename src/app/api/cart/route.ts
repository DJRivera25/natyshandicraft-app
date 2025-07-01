import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Cart } from '@/models/Cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { CartDocument } from '@/models/Cart';
import { CartItem } from '@/types/cart';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const cart = await Cart.findOne({ user: session.user.id });

  if (!cart) {
    return NextResponse.json({ items: [] });
  }

  const formattedCart = {
    ...cart.toObject(),
    items: cart.items.map((item: CartDocument['items'][number]) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image, // ✅ Make sure image is included
    })),
  };

  return NextResponse.json(formattedCart);
}

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const existing = await Cart.findOne({ user: session.user.id });

    if (existing) {
      existing.items = body.items;
      await existing.save();
      return NextResponse.json(existing);
    }

    const newCart = await Cart.create({
      user: session.user.id,
      items: body.items,
    });

    return NextResponse.json(newCart);
  } catch (err) {
    console.error('❌ POST /cart error:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    // Filter out the item with the matching productId
    cart.items = cart.items.filter(
      (item: CartItem) => item.productId.toString() !== productId
    );

    await cart.save();

    return NextResponse.json(
      { message: 'Item removed from cart', cart },
      { status: 200 }
    );
  } catch (err) {
    console.error('❌ DELETE /cart/item error:', err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

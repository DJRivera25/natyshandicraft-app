import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Payment } from '@/models/Payment';
import { Order, IOrderItem } from '@/models/Order';
import { Product } from '@/models/Product';
import { createNotification } from '@/lib/createNotification';

interface XenditWebhookPayload {
  id: string;
  status: 'PAID' | 'EXPIRED' | 'FAILED' | string;
  payment_channel?: string; // e.g. 'GCASH', 'CREDIT_CARD'
  [key: string]: unknown;
}

interface OrderUpdateData {
  status?: 'paid' | 'pending' | 'cancelled';
  paidAt?: Date;
  paymentMethod?: string;
}

function isValidXenditSignature(req: NextRequest): boolean {
  // Example: Xendit sends a callback token in the header 'x-callback-token'
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;
  const receivedToken = req.headers.get('x-callback-token');
  return !!expectedToken && receivedToken === expectedToken;
}

export async function POST(req: NextRequest) {
  console.log('✅ Webhook route HIT by Xendit');

  if (!isValidXenditSignature(req)) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = (await req.json()) as XenditWebhookPayload;

    console.log('[Xendit Webhook] Payload:', JSON.stringify(body, null, 2));

    const xenditInvoiceId = body.id;
    const rawStatus = body.status;
    const paymentChannel = (
      body.payment_channel as string | undefined
    )?.toLowerCase(); // Normalize: e.g. 'gcash'

    if (!xenditInvoiceId || !rawStatus) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const status = rawStatus.toLowerCase();
    const validStatuses = ['paid', 'expired', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Ignored status' }, { status: 200 });
    }

    // Map Xendit status to Payment model status
    const statusMap: Record<string, string> = {
      paid: 'succeeded',
      expired: 'failed',
      failed: 'failed',
    };
    const paymentStatus = statusMap[status] || 'pending';

    // 🔄 Update payment document
    const payment = await Payment.findOneAndUpdate(
      { providerPaymentId: xenditInvoiceId },
      {
        status: paymentStatus,
        ...(paymentChannel && { method: paymentChannel }),
        ...(status === 'paid' && { paidAt: new Date() }),
      },
      { new: true }
    );

    if (!payment) {
      console.warn(
        '[Xendit Webhook] No payment found for invoice ID:',
        xenditInvoiceId
      );
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }

    // ✅ Update the related order
    const orderUpdateData: OrderUpdateData = {};

    if (status === 'paid') {
      orderUpdateData.status = 'paid';
      orderUpdateData.paidAt = new Date();
    }

    if (paymentChannel) {
      orderUpdateData.paymentMethod = paymentChannel;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      payment.order,
      orderUpdateData,
      { new: true }
    );

    console.log(
      `[Webhook] Updated order ${payment.order} with:`,
      orderUpdateData
    );

    // 🟢 Create admin notification for order paid
    if (status === 'paid' && updatedOrder) {
      try {
        await createNotification({
          type: 'order_paid',
          message: `Order #${updatedOrder._id} has been paid by ${updatedOrder.user?.fullName || updatedOrder.user?.email || 'a customer'}`,
          meta: {
            orderId: updatedOrder._id,
            userId: updatedOrder.user?._id || updatedOrder.user,
            totalAmount: updatedOrder.totalAmount,
            paymentMethod: updatedOrder.paymentMethod,
          },
        });
      } catch (err) {
        console.error(
          'Failed to create admin notification for order paid:',
          err
        );
      }
    }

    // 🆕 Update product sold quantities when payment is successful
    if (status === 'paid' && updatedOrder) {
      try {
        // Update sold quantities for all products in the order
        const updatePromises = updatedOrder.items.map(
          async (item: IOrderItem) => {
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
              } else if (
                updatedProduct.stock > 0 &&
                updatedProduct.stock <= 5
              ) {
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
          }
        );

        await Promise.all(updatePromises);
        console.log(
          `[Webhook] Updated sold quantities for ${updatedOrder.items.length} products in order ${updatedOrder._id}`
        );
      } catch (error) {
        console.error(
          '[Webhook] Failed to update product sold quantities:',
          error
        );
        // Don't fail the webhook if product updates fail
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('[Xendit Webhook Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

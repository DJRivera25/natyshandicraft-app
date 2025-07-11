import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Payment } from '@/models/Payment';
import { Order, IOrderItem } from '@/models/Order';
import { Product } from '@/models/Product';

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

export async function POST(req: NextRequest) {
  console.log('✅ Webhook route HIT by Xendit');

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

    // 🔄 Update payment document
    const payment = await Payment.findOneAndUpdate(
      { providerPaymentId: xenditInvoiceId },
      {
        status,
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

    // 🆕 Update product sold quantities when payment is successful
    if (status === 'paid' && updatedOrder) {
      try {
        // Update sold quantities for all products in the order
        const updatePromises = updatedOrder.items.map(
          async (item: IOrderItem) => {
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

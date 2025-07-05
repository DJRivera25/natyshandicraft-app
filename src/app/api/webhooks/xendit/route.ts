import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Payment } from '@/models/Payment';
import { Order } from '@/models/Order';

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

    await Order.findByIdAndUpdate(payment.order, orderUpdateData);

    console.log(
      `[Webhook] Updated order ${payment.order} with:`,
      orderUpdateData
    );

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('[Xendit Webhook Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

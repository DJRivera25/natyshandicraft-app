import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceClient } from '@/lib/xendit';
import { connectDB } from '@/lib/db';
import { Payment } from '@/models/Payment';

export async function POST(req: NextRequest) {
  const { orderId, amount, customerName, customerEmail, userId } = await req.json();

  if (!orderId || !amount || !customerName || !customerEmail || !userId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();

  try {
    // ✅ Step 1: Check for existing pending payment for this order
    const existingPayment = await Payment.findOne({
      order: orderId,
      status: 'pending',
    });

    if (existingPayment) {
      return NextResponse.json({
        invoiceURL: `https://checkout-staging.xendit.co/web/${existingPayment.providerPaymentId}`,
        paymentId: existingPayment._id,
        reused: true, // optional
      });
    }

    // ✅ Step 2: No existing, create a new invoice
    const invoiceClient = getInvoiceClient();
    const invoice = await invoiceClient.createInvoice({
      data: {
        externalId: `order-${orderId}`,
        amount,
        payerEmail: customerEmail,
        description: `Payment for Order ${orderId}`,
        customer: {
          givenNames: customerName,
          email: customerEmail,
        },
        successRedirectUrl: `${process.env.NEXTAUTH_URL}/order/success`,
      },
    });

    const payment = await Payment.create({
      order: orderId,
      user: userId,
      method: 'gcash',
      status: 'pending',
      amount,
      currency: 'PHP',
      providerPaymentId: invoice.id,
      providerResponse: {
        invoiceId: invoice.id,
        payerName: customerName,
      },
    });

    return NextResponse.json({
      invoiceURL: invoice.invoiceUrl,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('❌ Xendit invoice creation failed:', error);
    return NextResponse.json(
      { message: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

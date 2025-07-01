import { Schema, model, models, Document, Types } from 'mongoose';

type PaymentMethod = 'stripe' | 'gcash' | 'bank' | 'cod';
type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

interface StripeResponse {
  chargeId: string;
  receiptUrl?: string;
  cardBrand?: string;
  cardLast4?: string;
}

interface GCashResponse {
  refNumber: string;
  payerName?: string;
}

interface BankResponse {
  accountName: string;
  accountNumber: string;
  bankName: string;
  depositSlipUrl?: string;
}

type ProviderResponse = StripeResponse | GCashResponse | BankResponse | null;

export interface IPayment extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  providerPaymentId: string;
  providerResponse: ProviderResponse;
  paidAt?: Date;
  errorMessage?: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    method: {
      type: String,
      enum: ['gcash', 'bank', 'cod', 'card'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'PHP' },

    transactionId: { type: String },
    providerPaymentId: { type: String, index: true }, // ✅ Added field

    providerResponse: {
      type: Object,
      default: null,
    },

    paidAt: { type: Date },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const Payment =
  models.Payment || model<IPayment>('Payment', PaymentSchema);

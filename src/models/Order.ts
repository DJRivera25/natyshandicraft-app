import { Schema, model, models, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  status: 'pending' | 'paid' | 'cancelled';
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>('Order', OrderSchema);

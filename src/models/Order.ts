import { Schema, model, models, Document, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status?: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  paidAt?: Date;
  cancelledAt?: Date;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  location?: {
    lat: number;
    lng: number;
    formattedAddress?: string;
  };
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const LocationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    formattedAddress: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String },
    paidAt: { type: Date },
    cancelledAt: { type: Date },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    location: LocationSchema,
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>('Order', OrderSchema);

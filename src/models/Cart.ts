import mongoose, { Schema, model, models, Document } from 'mongoose';

interface CartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string; // ✅ Added image
}

export interface CartDocument extends Document {
  user?: mongoose.Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true }, // ✅ Image required
  },
  { _id: false }
);

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = models.Cart || model<CartDocument>('Cart', cartSchema);

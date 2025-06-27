import { Schema, model, models, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  initialQuantity: number; // Starting stock
  inStock: boolean; // Whether the product is in stock
  createdBy?: Types.ObjectId; // Admin or vendor who added the product
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    imageUrl: { type: String },
    initialQuantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true }, // ✅ Added field
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Product =
  models.Product || model<IProduct>('Product', ProductSchema);

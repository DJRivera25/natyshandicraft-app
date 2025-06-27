import { Schema, model, models, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  initialQuantity: number;
  inStock: boolean;
  isActive: boolean; // ✅ new field
  createdBy?: Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    imageUrl: { type: String },
    initialQuantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }, // ✅ added here
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Product =
  models.Product || model<IProduct>('Product', ProductSchema);

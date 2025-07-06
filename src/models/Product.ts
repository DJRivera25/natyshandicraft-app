import { Schema, model, models, Document, Types } from 'mongoose';

interface IReview {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  discountPercent?: number;
  discountActive?: boolean;

  category?: string;
  imageUrl?: string; // main image
  perspectives?: string[]; // other angles/images

  initialQuantity: number;
  inStock: boolean;
  isActive: boolean;

  reviews: IReview[];
  averageRating?: number;
  numReviews?: number;

  createdBy?: Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountActive: { type: Boolean, default: false },
    discountedPrice: { type: Number }, // you may calculate and store during save

    category: { type: String },
    imageUrl: { type: String },
    perspectives: [{ type: String }],

    initialQuantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },

    reviews: [ReviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Product =
  models.Product || model<IProduct>('Product', ProductSchema);

import { Schema, model, models, Document, Types } from 'mongoose';

interface IReview {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  discountPercent?: number;
  discountActive?: boolean;

  category?: string;
  imageUrl?: string;
  perspectives?: string[];

  stock: number;
  soldQuantity: number;
  restockThreshold: number;
  lastRestockedAt?: Date;
  sku?: string;

  isActive: boolean;

  views: number;
  wishlistCount: number;
  tags?: string[];

  isFeatured: boolean;
  promoText?: string;
  availableFrom?: Date;
  availableUntil?: Date;

  visibility: 'public' | 'private';
  deletedAt?: Date;

  reviews: IReview[];
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

    category: { type: String },
    imageUrl: { type: String },
    perspectives: [{ type: String }],

    stock: { type: Number, default: 0 },
    soldQuantity: { type: Number, default: 0 },
    restockThreshold: { type: Number, default: 5 },
    lastRestockedAt: { type: Date },
    sku: { type: String, unique: true },

    isActive: { type: Boolean, default: true },

    views: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    tags: [{ type: String }],

    isFeatured: { type: Boolean, default: false },
    promoText: { type: String },
    availableFrom: { type: Date },
    availableUntil: { type: Date },

    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    deletedAt: { type: Date },

    reviews: [ReviewSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Product =
  models.Product || model<IProduct>('Product', ProductSchema);

import { Schema, model, models, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  mobileNumber?: string;
  fullName: string;
  birthDate?: Date;
  isAdmin: boolean;
  isChatSupport?: boolean; // New: true for chat support agents
  isSuperAdmin?: boolean; // New: true for super admin
  wishlist?: Types.ObjectId[];
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, unique: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date },
    isAdmin: { type: Boolean, default: false },
    isChatSupport: { type: Boolean, default: false }, // New
    isSuperAdmin: { type: Boolean, default: false }, // New
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    address: {
      street: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
      country: { type: String, default: 'Philippines' },
    },
  },
  { timestamps: true }
);

// Prevent model overwrite error in dev
export const User = models.User || model<IUser>('User', UserSchema);

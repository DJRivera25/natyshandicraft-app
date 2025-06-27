import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  mobileNumber?: string;
  fullName: string;
  birthDate?: Date;
  isAdmin: boolean;
  address?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, unique: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date }, // 🟢 added default
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite error in dev
export const User = models.User || model<IUser>('User', UserSchema);

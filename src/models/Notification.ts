import mongoose, { Schema, Document } from 'mongoose';

export interface Notification extends Document {
  type: string;
  message: string;
  createdAt: Date;
  read: boolean;
  meta?: Record<string, unknown>;
  targetAdminId?: string;
}

const NotificationSchema = new Schema<Notification>({
  type: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  meta: { type: Schema.Types.Mixed },
  targetAdminId: { type: String },
});

export default mongoose.models.Notification ||
  mongoose.model<Notification>('Notification', NotificationSchema);

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  chatRoom: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  createdAt: Date;
  read?: boolean;
}

const MessageSchema = new Schema<IMessage>({
  chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema);

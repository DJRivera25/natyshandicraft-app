import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChatRoom extends Document {
  participants: Types.ObjectId[]; // [userId, adminId]
  lastMessage?: Types.ObjectId;
  updatedAt: Date;
}

const ChatRoomSchema = new Schema<IChatRoom>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  updatedAt: { type: Date, default: Date.now },
});

ChatRoomSchema.index({ participants: 1 }, { unique: false });

export default mongoose.models.ChatRoom ||
  mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);

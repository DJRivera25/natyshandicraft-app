import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const chatRoomId = searchParams.get('chatRoomId');
  if (!chatRoomId) {
    return NextResponse.json({ error: 'chatRoomId required' }, { status: 400 });
  }
  const messages = await Message.find({ chatRoom: chatRoomId }).sort({
    createdAt: 1,
  });
  // Serialize createdAt to ISO string
  const serializedMessages = messages.map((msg) => ({
    ...msg.toObject(),
    createdAt:
      msg.createdAt instanceof Date
        ? msg.createdAt.toISOString()
        : msg.createdAt,
  }));
  return NextResponse.json({ messages: serializedMessages });
}

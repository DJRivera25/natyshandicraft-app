import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { pusherServer } from '@/lib/pusherServer';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { error: 'Message ID is required' },
      { status: 400 }
    );
  }
  const message = await Message.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }
  // Real-time: Notify chat room of seen status
  await pusherServer.trigger(`chat-room-${message.chatRoom}`, 'message-seen', {
    messageId: message._id,
    userId: session.user.id,
    seenAt: new Date().toISOString(),
  });
  return NextResponse.json({ message });
}

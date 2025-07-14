import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import ChatRoom from '@/models/ChatRoom';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { pusherServer } from '@/lib/pusherServer';

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { chatRoomId, content } = await req.json();
  if (!chatRoomId || !content) {
    return NextResponse.json(
      { error: 'chatRoomId and content required' },
      { status: 400 }
    );
  }
  const message = await Message.create({
    chatRoom: chatRoomId,
    sender: session.user.id,
    content,
  });
  // Update lastMessage in ChatRoom
  await ChatRoom.findByIdAndUpdate(chatRoomId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });
  // Trigger Pusher event for this chat room
  await pusherServer.trigger(`chat-room-${chatRoomId}`, 'new-message', {
    _id: message._id,
    chatRoom: message.chatRoom,
    sender: message.sender,
    content: message.content,
    createdAt: message.createdAt,
  });
  return NextResponse.json({ message });
}

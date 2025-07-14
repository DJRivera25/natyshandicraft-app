import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { pusherServer } from '@/lib/pusherServer';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id: chatRoomId } = params;
  const { isTyping } = await req.json();
  if (typeof isTyping !== 'boolean') {
    return NextResponse.json(
      { error: 'isTyping boolean required' },
      { status: 400 }
    );
  }
  await pusherServer.trigger(`chat-room-${chatRoomId}`, 'typing', {
    userId: session.user.id,
    isTyping,
  });
  return NextResponse.json({ success: true });
}

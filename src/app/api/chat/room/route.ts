import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ChatRoom from '@/models/ChatRoom';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { participantId } = await req.json();
  const userId = session.user.id;
  // Find or create a room with these two participants
  let room = await ChatRoom.findOne({
    participants: { $all: [userId, participantId], $size: 2 },
  });
  if (!room) {
    room = await ChatRoom.create({ participants: [userId, participantId] });
  }
  return NextResponse.json({ room });
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const isAdmin = session.user.isAdmin;

  let rooms;
  if (isAdmin) {
    // Admins see all chat rooms
    rooms = await ChatRoom.find({}).sort({ updatedAt: -1 });
  } else {
    rooms = await ChatRoom.find({ participants: userId }).sort({
      updatedAt: -1,
    });
  }
  return NextResponse.json({ rooms });
}

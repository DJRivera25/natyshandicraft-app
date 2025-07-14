import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import { pusherServer } from '@/lib/pusherServer';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// GET: Fetch notifications (optionally add pagination/filtering)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const notifications = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(50);
  return NextResponse.json({ notifications });
}

// POST: Create notification and trigger Pusher
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const { type, message, meta, targetAdminId } = body;
  if (!type || !message) {
    return NextResponse.json(
      { error: 'type and message are required' },
      { status: 400 }
    );
  }
  const notification = await Notification.create({
    type,
    message,
    meta,
    targetAdminId,
  });
  // Trigger Pusher event (e.g., 'admin-notifications' channel)
  await pusherServer.trigger('admin-notifications', 'new-notification', {
    _id: notification._id,
    type: notification.type,
    message: notification.message,
    createdAt: notification.createdAt,
    read: notification.read,
    meta: notification.meta,
    targetAdminId: notification.targetAdminId,
  });
  return NextResponse.json({ notification });
}

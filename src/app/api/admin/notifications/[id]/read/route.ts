import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import { connectDB } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { error: 'Notification ID is required' },
      { status: 400 }
    );
  }
  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true },
    { new: true }
  );
  if (!notification) {
    return NextResponse.json(
      { error: 'Notification not found' },
      { status: 404 }
    );
  }
  return NextResponse.json({ notification });
}

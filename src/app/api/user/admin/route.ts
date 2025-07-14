import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  await connectDB();
  // Find the first user who is both admin and chat support
  const admin = await User.findOne(
    { isAdmin: true, isChatSupport: true },
    '_id fullName email'
  );
  if (!admin) {
    return NextResponse.json(
      { error: 'No chat support admin found' },
      { status: 404 }
    );
  }
  return NextResponse.json({ admin });
}

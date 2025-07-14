import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  await connectDB();
  // Find all users who are both admin and chat support
  const admins = await User.find(
    { isAdmin: true, isChatSupport: true },
    '_id fullName email'
  );
  return NextResponse.json({ admins });
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  await connectDB();
  // Find the first user who is super admin
  const superAdmin = await User.findOne(
    { isSuperAdmin: true },
    '_id fullName email'
  );
  if (!superAdmin) {
    return NextResponse.json(
      { error: 'No super admin found' },
      { status: 404 }
    );
  }
  return NextResponse.json({ superAdmin });
}

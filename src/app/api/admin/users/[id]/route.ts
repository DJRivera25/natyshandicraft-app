import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  // Only superAdmin can update user roles
  const superAdmin = await User.findOne({
    _id: session.user.id,
    isSuperAdmin: true,
  });
  if (!superAdmin) {
    return NextResponse.json(
      { message: 'Forbidden: Only super admin can manage user roles' },
      { status: 403 }
    );
  }
  const { id } = params;
  const { isAdmin, isChatSupport, isSuperAdmin } = await req.json();
  const update: Record<string, boolean> = {};
  if (typeof isAdmin === 'boolean') update.isAdmin = isAdmin;
  if (typeof isChatSupport === 'boolean') update.isChatSupport = isChatSupport;
  if (typeof isSuperAdmin === 'boolean') update.isSuperAdmin = isSuperAdmin;
  const user = await User.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ user });
}

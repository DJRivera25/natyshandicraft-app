import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const search = searchParams.get('search')?.trim() || '';
  const role = searchParams.get('role');
  const status = searchParams.get('status');

  const query: Record<string, unknown> = {};
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) query.isAdmin = role === 'admin';
  if (status) query.status = status;

  try {
    const total = await User.countDocuments(query);
    const users = await User.find(
      query,
      'id fullName email isAdmin status createdAt'
    )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return NextResponse.json({ users, total, page, limit });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch users', error: (error as Error).message },
      { status: 500 }
    );
  }
}

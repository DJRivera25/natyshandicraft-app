import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { birthDate, mobileNumber, address } = body;

    // Validate required fields
    const requiredFields = [
      address?.street,
      address?.brgy,
      address?.city,
      address?.province,
      address?.postalCode,
      address?.country,
    ];

    if (!birthDate || !mobileNumber || requiredFields.some((f) => !f)) {
      return NextResponse.json(
        { message: 'All fields are required and address must be complete' },
        { status: 400 }
      );
    }

    // Parse and validate birthDate
    const parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid birthDate format' },
        { status: 400 }
      );
    }

    // ✅ Age validation (must be at least 18 years old)
    const today = new Date();
    const age = today.getFullYear() - parsedBirthDate.getFullYear();
    const monthDiff = today.getMonth() - parsedBirthDate.getMonth();
    const dayDiff = today.getDate() - parsedBirthDate.getDate();
    const hasHadBirthdayThisYear =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
    const realAge = hasHadBirthdayThisYear ? age : age - 1;

    if (realAge < 18) {
      return NextResponse.json(
        { message: 'You must be at least 18 years old to continue' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ✅ Check if mobile number is already in use by another user
    const existingMobile = await User.findOne({
      mobileNumber,
      _id: { $ne: currentUser._id }, // exclude current user
    });

    if (existingMobile) {
      return NextResponse.json(
        { message: 'Mobile number is already in use by another account' },
        { status: 409 }
      );
    }

    // ✅ Update user profile
    await User.findByIdAndUpdate(
      currentUser._id,
      {
        $set: {
          birthDate: parsedBirthDate,
          mobileNumber,
          address,
        },
      },
      { new: true }
    );

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// pages/api/user/update-profile.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      console.warn('[WARN] No session or email found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { birthDate, mobileNumber, address } = req.body;

    console.log('\n--- Incoming Payload ---');
    console.log('Email:', session.user.email);
    console.log('Raw birthDate:', birthDate);
    console.log('Mobile Number:', mobileNumber);
    console.log('Address:', address);

    if (!birthDate || !mobileNumber || !address) {
      console.warn('[WARN] Missing one or more required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedBirthDate = new Date(birthDate);
    console.log('Parsed birthDate:', parsedBirthDate);
    console.log(
      'parsedBirthDate instanceof Date:',
      parsedBirthDate instanceof Date
    );
    console.log(
      'parsedBirthDate.toISOString():',
      parsedBirthDate.toISOString()
    );

    if (isNaN(parsedBirthDate.getTime())) {
      console.error('[ERROR] Invalid date format:', birthDate);
      return res.status(400).json({ message: 'Invalid birthDate format' });
    }

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          birthDate: parsedBirthDate,
          mobileNumber,
          address,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error('[ERROR] User not found for email:', session.user.email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('\n--- Update Successful ---');
    console.log('Updated User:', updatedUser?.toObject());

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('[ERROR] Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

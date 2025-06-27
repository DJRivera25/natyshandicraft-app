'use client';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/features/auth/authSlice';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/utils/api/user';

export default function CompleteProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch(); // ✅ now it is being used
  // Form state
  const [birthDate, setBirthDate] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user is not logged in or profile already complete
  useEffect(() => {
    if (status === 'loading') return; // wait for session to load

    if (!session) {
      // Not logged in, redirect to login page
      router.push('/login');
      return;
    }

    // If profile already complete, redirect to homepage or dashboard
    if (
      session.user.birthDate &&
      session.user.mobileNumber &&
      session.user.address
    ) {
      router.push('/');
    }
  }, [session, status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateUserProfile({
        birthDate,
        mobileNumber,
        address,
      });

      dispatch(updateProfile({ birthDate, mobileNumber, address }));
      router.push('/'); // redirect
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setLoading(false);
    }
  }

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}

        <label className="block">
          <span>Birthdate</span>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span>Mobile Number</span>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            placeholder="+63 912 345 6789"
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span>Address</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </main>
  );
}

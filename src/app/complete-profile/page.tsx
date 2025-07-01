'use client';

import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/features/auth/authSlice';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/utils/api/user';
import type { Address } from '@/types/user';

export default function CompleteProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [birthDate, setBirthDate] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState<Address>({
    street: '',
    brgy: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Philippines',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateUserProfile({ birthDate, mobileNumber, address });

      // Update Redux state (optional if middleware always checks token)
      dispatch(updateProfile({ birthDate, mobileNumber, address }));

      // 🔁 Optional session refresh to ensure consistency in client
      await fetch('/api/auth/session?update');

      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  }

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

        <fieldset className="space-y-2 border-t pt-4">
          <legend className="text-lg font-semibold">Address</legend>
          {[
            { name: 'street', placeholder: 'Street' },
            { name: 'brgy', placeholder: 'Barangay' },
            { name: 'city', placeholder: 'City' },
            { name: 'province', placeholder: 'Province' },
            { name: 'postalCode', placeholder: 'Postal Code' },
            { name: 'country', placeholder: 'Country' },
          ].map((field) => (
            <input
              key={field.name}
              type="text"
              placeholder={field.placeholder}
              value={address[field.name as keyof Address]}
              onChange={(e) =>
                setAddress({ ...address, [field.name]: e.target.value })
              }
              required
              className="block w-full rounded border px-3 py-2"
            />
          ))}
        </fieldset>

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

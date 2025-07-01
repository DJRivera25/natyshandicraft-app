'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfile } from '@/features/auth/authSlice';
import { useState, useEffect } from 'react';
import { updateUserProfile } from '@/utils/api/user';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isProfileComplete } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const initialForm = {
    mobileNumber: user?.mobileNumber || '',
    address: {
      street: user?.address?.street || '',
      brgy: user?.address?.brgy || '',
      city: user?.address?.city || '',
      province: user?.address?.province || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'Philippines',
    },
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (user) {
      setForm({
        mobileNumber: user.mobileNumber || '',
        address: {
          street: user.address?.street || '',
          brgy: user.address?.brgy || '',
          city: user.address?.city || '',
          province: user.address?.province || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || 'Philippines',
        },
      });
    }
  }, [user, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        mobileNumber: form.mobileNumber,
        address: form.address,
        birthDate: user?.birthDate || '',
      });

      dispatch(updateProfile({ mobileNumber: form.mobileNumber, address: form.address }));
      setIsEditing(false);
    } catch (err) {
      console.error('❌ Update failed:', err);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-500">
        You are not logged in.
      </div>
    );
  }

  const { fullName, email, birthDate, isAdmin } = user;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="space-y-4 border rounded-lg p-6 shadow-sm bg-white">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium">{fullName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Mobile Number</p>
          {isEditing ? (
            <input
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              className="w-full rounded border px-3 py-1"
            />
          ) : (
            <p className="font-medium">{form.mobileNumber || 'N/A'}</p>
          )}
        </div>

        {birthDate && (
          <div>
            <p className="text-sm text-gray-500">Birth Date</p>
            <p className="font-medium">{birthDate}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium">{isAdmin ? 'Admin' : 'User'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Address</p>
          {isEditing ? (
            <>
              {['street', 'brgy', 'city', 'province', 'postalCode', 'country'].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={form.address[field as keyof typeof form.address]}
                  onChange={handleChange}
                  placeholder={field}
                  className="w-full rounded border px-3 py-1 mb-1"
                />
              ))}
            </>
          ) : (
            <p className="font-medium">
              {form.address.street}, {form.address.brgy && `${form.address.brgy}, `}
              {form.address.city}, {form.address.province}, {form.address.postalCode},{' '}
              {form.address.country}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">Profile Status</p>
          <p
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              isProfileComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {isProfileComplete ? 'Complete' : 'Incomplete'}
          </p>
        </div>

        <div className="pt-4 space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-violet-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

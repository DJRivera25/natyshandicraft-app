'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfile } from '@/features/auth/authSlice';
import { useState, useEffect, useCallback } from 'react';
import { updateUserProfile } from '@/utils/api/user';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Settings,
  Heart,
  Package,
  CreditCard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isProfileComplete } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    mobileNumber: user?.mobileNumber || '',
    address: {
      street: user?.address?.street || '',
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
          city: user.address?.city || '',
          province: user.address?.province || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || 'Philippines',
        },
      });
    }
  }, [user, isEditing]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name in form.address) {
        setForm((prev) => ({
          ...prev,
          address: { ...prev.address, [name]: value },
        }));
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    },
    [form.address]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        mobileNumber: form.mobileNumber,
        address: form.address,
        birthDate: user?.birthDate || '',
      });

      dispatch(
        updateProfile({
          mobileNumber: form.mobileNumber,
          address: form.address,
        })
      );
      setIsEditing(false);
    } catch (err) {
      console.error('❌ Update failed:', err);
    } finally {
      setSaving(false);
    }
  }, [form, user?.birthDate, dispatch]);

  const handleCancel = useCallback(() => {
    setForm(initialForm);
    setIsEditing(false);
  }, [initialForm]);

  if (!user) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <User className="w-12 h-12 text-amber-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-amber-900 mb-3">
              Please log in
            </h2>
            <p className="text-amber-700 mb-8">
              You need to be logged in to view your profile.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
            >
              Login
            </motion.button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  const { fullName, email, birthDate, isAdmin } = user;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-200/60 shadow-sm"
          >
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                {/* Title and Status */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900">
                      My Profile
                    </h1>
                    <p className="text-amber-700 text-xs sm:text-sm">
                      Manage your account information
                    </p>
                  </div>

                  {/* Profile Status */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        isProfileComplete
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isProfileComplete ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {isProfileComplete ? 'Complete' : 'Incomplete'}
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 p-3 sm:p-4 md:p-6">
            {/* Profile Information */}
            <div className="flex-1 space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-amber-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </h2>
                  {!isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-all text-sm font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Full Name
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {fullName}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email Address
                    </label>
                    <p className="text-sm font-medium text-gray-900">{email}</p>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Mobile Number
                    </label>
                    {isEditing ? (
                      <input
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                        placeholder="Enter mobile number"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">
                        {form.mobileNumber || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Birth Date */}
                  {birthDate && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Birth Date
                      </label>
                      <p className="text-sm font-medium text-gray-900">
                        {birthDate}
                      </p>
                    </div>
                  )}

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Account Role
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {isAdmin ? 'Administrator' : 'Customer'}
                      </span>
                      {isAdmin && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Address Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>

                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        field: 'street',
                        label: 'Street Address',
                        icon: MapPin,
                      },
                      {
                        field: 'city',
                        label: 'City/Municipality',
                        icon: MapPin,
                      },
                      {
                        field: 'province',
                        label: 'Province',
                        icon: MapPin,
                      },
                      {
                        field: 'postalCode',
                        label: 'Postal Code',
                        icon: MapPin,
                      },
                      { field: 'country', label: 'Country', icon: MapPin },
                    ].map(({ field, label, icon: Icon }) => (
                      <div key={field} className="space-y-1">
                        <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          {label}
                        </label>
                        <input
                          name={field}
                          value={
                            form.address[field as keyof typeof form.address]
                          }
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                          placeholder={`Enter ${label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        <p className="text-gray-900">
                          {[
                            form.address.street,
                            form.address.city,
                            form.address.province,
                            form.address.postalCode,
                            form.address.country,
                          ]
                            .filter(Boolean)
                            .join(', ') || 'No address provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Quick Actions Sidebar */}
            <div className="lg:w-80">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/profile/orders')}
                      className="w-full flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all text-left"
                    >
                      <Package className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900">My Orders</p>
                        <p className="text-xs text-amber-700">
                          View order history
                        </p>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/cart')}
                      className="w-full flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all text-left"
                    >
                      <Heart className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900">
                          Shopping Cart
                        </p>
                        <p className="text-xs text-amber-700">
                          View cart items
                        </p>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/products')}
                      className="w-full flex items-center gap-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all text-left"
                    >
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-900">
                          Continue Shopping
                        </p>
                        <p className="text-xs text-amber-700">
                          Browse products
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Profile Completion */}
                {!isProfileComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-2">
                          Complete Your Profile
                        </h4>
                        <p className="text-sm text-amber-800 mb-3">
                          Add your mobile number and shipping address to enable
                          checkout.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-all"
                        >
                          Complete Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

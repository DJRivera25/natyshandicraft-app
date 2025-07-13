'use client';

import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateUserProfile } from '@/utils/api/user';
import type { Address } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FieldErrors } from 'react-hook-form';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useJsApiLoader } from '@react-google-maps/api';
import GoogleMapSelector from '@/components/GoogleMapSelector';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import {
  Calendar,
  Phone,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';

const defaultLatLng = { lat: 14.5995, lng: 120.9842 }; // Manila center

type FormValues = {
  birthDate: Date | null;
  mobileNumber: string;
  address: Address;
};

export default function CompleteProfilePage() {
  const { update } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [markerPosition, setMarkerPosition] = useState(defaultLatLng);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      birthDate: null,
      mobileNumber: '',
      address: {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Philippines',
      },
    },
  });

  const birthDate = watch('birthDate');
  const addressErrors: FieldErrors<Address> | undefined = errors.address;

  const onSubmit = async (data: FormValues) => {
    setError('');
    setSuccess('');
    if (!data.birthDate) {
      setError('Birthdate is required');
      return;
    }

    try {
      const formattedDate = format(data.birthDate, 'yyyy-MM-dd');

      await updateUserProfile({
        birthDate: formattedDate,
        mobileNumber: data.mobileNumber,
        address: data.address,
      });

      dispatch(
        updateProfile({
          birthDate: formattedDate,
          mobileNumber: data.mobileNumber,
          address: data.address,
        })
      );

      setSuccess('Profile updated successfully!');
      await update(); // Refresh session

      // Redirect after a brief delay to show success message
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;

      const message =
        axiosError?.response?.data?.message ||
        (err instanceof Error ? err.message : 'An unknown error occurred');

      if (message.includes('Mobile number is already in use')) {
        setError('Mobile number is already associated with another account.');
      } else if (message.includes('at least 18 years old')) {
        setError('You must be at least 18 years old to continue.');
      } else {
        setError(message);
      }
    }
  };

  const reverseGeocode = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const place = results[0];
        const getComp = (type: string) =>
          place.address_components?.find((c) => c.types.includes(type))
            ?.long_name ?? '';

        const streetNumber = getComp('street_number');
        const route = getComp('route');
        const city = getComp('locality');
        const province = getComp('administrative_area_level_1');
        const postalCode = getComp('postal_code');
        const country = getComp('country');

        setValue(
          'address.street',
          [streetNumber, route].filter(Boolean).join(' ')
        );
        setValue('address.city', city);
        setValue('address.province', province);
        setValue('address.postalCode', postalCode);
        setValue('address.country', country);
      }
    });
  };

  useEffect(() => {
    if (showMap && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(current);
          setMarkerPosition(current);
          mapRef?.panTo(current);
          reverseGeocode(current.lat, current.lng);
        },
        () => {
          setUserLocation(defaultLatLng);
          setMarkerPosition(defaultLatLng);
          mapRef?.panTo(defaultLatLng);
          reverseGeocode(defaultLatLng.lat, defaultLatLng.lng);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [showMap]);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 lg:py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900">
                Complete Your Profile
              </h1>
            </div>
            <p className="text-amber-700 text-sm sm:text-base max-w-2xl mx-auto">
              Help us personalize your experience by providing a few more
              details about yourself
            </p>
          </motion.div>

          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-amber-200/60 overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 sm:px-6 py-4 sm:py-6 border-b border-amber-200/60">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-amber-900">
                    Personal Information
                  </h2>
                  <p className="text-amber-700 text-sm">
                    This information helps us provide you with a better shopping
                    experience
                  </p>
                </div>
              </div>
            </div>

            {/* Alert Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-4 sm:mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-green-700 text-sm">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 sm:p-6 space-y-6"
            >
              {/* Personal Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Personal Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Birthdate */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-500" />
                      Birthdate <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      selected={birthDate}
                      onChange={(date) => setValue('birthDate', date)}
                      maxDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select your birthdate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                    />
                    {!birthDate && (
                      <p className="text-xs text-red-600">
                        Birthdate is required
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-amber-500" />
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('mobileNumber', {
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^(\+63|0)?9\d{9}$/,
                          message: 'Invalid PH mobile number format',
                        },
                      })}
                      placeholder="+63 912 345 6789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                    />
                    {errors.mobileNumber && (
                      <p className="text-xs text-red-600">
                        {errors.mobileNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-green-500" />
                    Address Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(
                    [
                      { name: 'street', placeholder: 'Street Address' },
                      { name: 'city', placeholder: 'City' },
                      { name: 'province', placeholder: 'Province' },
                      { name: 'postalCode', placeholder: 'Postal Code' },
                      { name: 'country', placeholder: 'Country' },
                    ] as const
                  ).map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.placeholder}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        {...register(`address.${field.name}`, {
                          required: `${field.placeholder} is required`,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                      />
                      {addressErrors?.[field.name] && (
                        <p className="text-xs text-red-600">
                          {addressErrors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Map Selection */}
                {isLoaded && (
                  <div className="flex justify-center pt-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMap(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl text-sm"
                    >
                      <MapPin className="w-4 h-4" />
                      Choose Location on Map
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Map Component */}
              <AnimatePresence>
                {isLoaded && showMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GoogleMapSelector
                      showSearch={showSearch}
                      setShowSearch={setShowSearch}
                      userLocation={userLocation}
                      markerPosition={markerPosition}
                      setMarkerPosition={setMarkerPosition}
                      mapRef={mapRef}
                      setMapRef={setMapRef}
                      reverseGeocode={reverseGeocode}
                      onClose={() => setShowMap(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-200">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      Save & Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6 sm:mt-8"
          >
            <p className="text-amber-700 text-sm flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Thank you for crafting your journey with us
              <Sparkles className="w-3 h-3" />
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}

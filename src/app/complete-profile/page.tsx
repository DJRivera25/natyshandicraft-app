'use client';

import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { updateUserProfile } from '@/utils/api/user';
import type { Address } from '@/types/user';
import { motion } from 'framer-motion';
import { useForm, FieldErrors } from 'react-hook-form';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  useJsApiLoader,
  Autocomplete,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';
import { Search, X } from 'lucide-react';

const defaultLatLng = { lat: 14.5995, lng: 120.9842 }; // Manila

type FormValues = {
  birthDate: Date | null;
  mobileNumber: string;
  address: Address;
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const [markerPosition, setMarkerPosition] = useState(defaultLatLng);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
        brgy: '',
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

      setTimeout(() => {
        router.replace('/');
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    }
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (
      !place.geometry ||
      !place.geometry.location ||
      !place.address_components
    )
      return;

    const location = place.geometry.location;
    const lat = location.lat();
    const lng = location.lng();

    setMarkerPosition({ lat, lng });
    mapRef?.panTo({ lat, lng });
    reverseGeocode(lat, lng);
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
        const brgy = getComp('sublocality') || getComp('neighborhood');
        const city = getComp('locality');
        const province = getComp('administrative_area_level_1');
        const postalCode = getComp('postal_code');
        const country = getComp('country');

        setValue(
          'address.street',
          [streetNumber, route].filter(Boolean).join(' ')
        );
        setValue('address.brgy', brgy);
        setValue('address.city', city);
        setValue('address.province', province);
        setValue('address.postalCode', postalCode);
        setValue('address.country', country);
      }
    });
  };

  // Get user location on map open
  useEffect(() => {
    if (showMap && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const current = { lat, lng };
          setMarkerPosition(current);
          mapRef?.panTo(current);
          reverseGeocode(lat, lng);
        },
        () => {
          // fallback to Manila
          setMarkerPosition(defaultLatLng);
          mapRef?.panTo(defaultLatLng);
          reverseGeocode(defaultLatLng.lat, defaultLatLng.lng);
        }
      );
    }
  }, [showMap]);

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-amber-50 via-amber-100 to-amber-50 px-4 py-10"
    >
      <div className="relative z-10 w-full max-w-2xl space-y-6 rounded-2xl border border-amber-300 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
        <h1 className="text-center text-2xl sm:text-3xl font-serif font-extrabold text-amber-900">
          Complete Your Profile
        </h1>

        {error && (
          <div className="rounded bg-red-100 px-4 py-2 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 relative z-10"
        >
          {/* Birthdate */}
          <div>
            <label className="block text-sm font-medium text-amber-800">
              Birthdate
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-200"
            />
            {!birthDate && (
              <p className="mt-1 text-sm text-red-600">Birthdate is required</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-amber-800">
              Mobile Number
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-200"
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-red-600">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* Address Fields */}
          <div>
            <legend className="mb-2 text-lg font-semibold text-amber-900">
              Address Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(
                [
                  { name: 'street', placeholder: 'Street' },
                  { name: 'brgy', placeholder: 'Barangay' },
                  { name: 'city', placeholder: 'City' },
                  { name: 'province', placeholder: 'Province' },
                  { name: 'postalCode', placeholder: 'Postal Code' },
                  { name: 'country', placeholder: 'Country' },
                ] as const
              ).map((field) => (
                <div key={field.name}>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    {...register(`address.${field.name}`, {
                      required: `${field.placeholder} is required`,
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-200"
                  />
                  {addressErrors?.[field.name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {addressErrors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Choose on Map Button */}
          {isLoaded && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="mb-6 rounded-lg bg-amber-500 px-6 py-2 text-white hover:bg-amber-600"
              >
                Choose on Map
              </button>
            </div>
          )}

          {/* Google Map Section */}
          {isLoaded && showMap && (
            <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden border border-gray-300 z-20">
              <label className="block text-sm font-medium text-amber-800 mb-2 px-1 pt-1">
                Search or Pin your Location
              </label>

              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="absolute top-3 right-3 z-30 bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              {showSearch && (
                <Autocomplete
                  onLoad={(auto) => {
                    autocompleteRef.current = auto;
                    auto.addListener('place_changed', onPlaceChanged);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search for your address..."
                    className="absolute top-14 right-4 z-20 w-[calc(100%-2rem)] max-w-md rounded-md border border-gray-300 bg-white px-4 py-2 shadow-md focus:border-amber-500 focus:ring-amber-200"
                  />
                </Autocomplete>
              )}

              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="absolute top-3 left-3 z-30 bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                {showSearch ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>

              <GoogleMap
                center={markerPosition}
                zoom={15}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={(map) => setMapRef(map)}
                onClick={(e) => {
                  const lat = e.latLng?.lat();
                  const lng = e.latLng?.lng();
                  if (lat && lng) {
                    setMarkerPosition({ lat, lng });
                    reverseGeocode(lat, lng);
                  }
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable
                  onDragEnd={(e) => {
                    const lat = e.latLng?.lat();
                    const lng = e.latLng?.lng();
                    if (lat && lng) {
                      setMarkerPosition({ lat, lng });
                      reverseGeocode(lat, lng);
                    }
                  }}
                />
              </GoogleMap>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>

        <p className="text-center text-sm text-amber-800 select-none">
          Thank you for crafting your journey with us. ✨
        </p>
      </div>
    </motion.main>
  );
}

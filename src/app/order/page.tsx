'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { createOrderThunk } from '@/features/order/orderThunk';
import type { CreateOrderInput } from '@/types/order';
import { apiCreateXenditInvoice } from '@/utils/api/xendit';
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  Shield,
  Lock,
  Navigation,
  Crosshair,
} from 'lucide-react';
import { useHasMounted } from '@/utils/useHasMounted';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import GoogleMapSelector from '@/components/GoogleMapSelector';
import ProgressTracker from '@/components/ProgressTracker';
import { useJsApiLoader } from '@react-google-maps/api';
import { useToast } from '@/components/Toast';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasMounted = useHasMounted();
  const { showToast } = useToast();

  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user);
  const userAddress = user?.address;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showMap, setShowMap] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral>({
      lat: 14.5995,
      lng: 120.9842,
    });
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const [address, setAddress] = useState({
    street: userAddress?.street || '',
    city: userAddress?.city || '',
    province: userAddress?.province || '',
    postalCode: userAddress?.postalCode || '',
    country: userAddress?.country || 'Philippines',
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = useCallback(async () => {
    if (!user) return setError('Please log in to place your order.');
    if (items.length === 0) return setError('Your cart is empty.');

    const requiredFields = ['street', 'city', 'province', 'postalCode'];
    const hasEmpty = requiredFields.some(
      (key) => !address[key as keyof typeof address]
    );
    if (hasEmpty) return setError('Please complete all address fields.');

    const orderData: CreateOrderInput = {
      user: user.id,
      items: items.map(({ productId, name, price, quantity }) => ({
        productId,
        name,
        price,
        quantity,
      })),
      totalAmount,
      paymentMethod,
      status: 'pending',
      address,
      // Include location data if available
      ...(markerPosition && {
        location: {
          lat: markerPosition.lat,
          lng: markerPosition.lng,
          formattedAddress: [
            address.street,
            address.city,
            address.province,
            address.postalCode,
          ]
            .filter(Boolean)
            .join(', '),
        },
      }),
    };

    setLoading(true);
    setError('');

    try {
      const order = await dispatch(createOrderThunk(orderData));

      if (!order || !('_id' in order)) {
        showToast('error', 'No order found. Redirecting to your orders...');
        router.push('/profile/orders');
        return;
      }

      dispatch(clearCart());

      if (paymentMethod === 'cod') {
        router.push('/order/success');
        return;
      }

      showToast('info', 'Redirecting to Xendit for payment...');
      const { invoiceURL } = await apiCreateXenditInvoice({
        orderId: order._id,
        userId: user.id,
        amount: totalAmount,
        customerName: user.fullName || 'Customer',
        customerEmail: user.email,
      });

      window.location.href = invoiceURL;
    } catch (err) {
      console.error('❌ Order placement failed:', err);
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong.');
    }

    setLoading(false);
  }, [
    user,
    items,
    address,
    paymentMethod,
    totalAmount,
    dispatch,
    router,
    showToast,
    markerPosition,
  ]);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentLocation);
          setMarkerPosition(currentLocation);
          if (mapRef) {
            mapRef.panTo(currentLocation);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [mapRef]);

  // Reverse geocoding function
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const result = data.results[0];
        const addressComponents = result.address_components;

        // Define proper types for address components
        interface AddressComponent {
          long_name: string;
          short_name: string;
          types: string[];
        }

        // Extract address components
        const streetNumber =
          addressComponents.find((comp: AddressComponent) =>
            comp.types.includes('street_number')
          )?.long_name || '';
        const route =
          addressComponents.find((comp: AddressComponent) =>
            comp.types.includes('route')
          )?.long_name || '';
        const locality =
          addressComponents.find((comp: AddressComponent) =>
            comp.types.includes('locality')
          )?.long_name || '';
        const administrativeArea =
          addressComponents.find((comp: AddressComponent) =>
            comp.types.includes('administrative_area_level_1')
          )?.long_name || '';
        const postalCode =
          addressComponents.find((comp: AddressComponent) =>
            comp.types.includes('postal_code')
          )?.long_name || '';

        // Update address state
        setAddress((prev) => ({
          ...prev,
          street: streetNumber && route ? `${streetNumber} ${route}` : route,
          city: locality,
          province: administrativeArea,
          postalCode: postalCode,
        }));

        setAddressConfirmed(true);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  }, []);

  // Handle marker position change
  const handleMarkerPositionChange = useCallback(
    (newPosition: google.maps.LatLngLiteral) => {
      setMarkerPosition(newPosition);
      reverseGeocode(newPosition.lat, newPosition.lng);
    },
    [reverseGeocode]
  );

  useEffect(() => {
    if (userAddress) {
      setAddress({
        street: userAddress.street || '',
        city: userAddress.city || '',
        province: userAddress.province || '',
        postalCode: userAddress.postalCode || '',
        country: userAddress.country || 'Philippines',
      });
    }
  }, [userAddress]);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // 🛡️ Guard against SSR mismatch and undefined array
  if (!hasMounted || !Array.isArray(items)) return null;

  if (!items.length) return null;

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
                {/* Title and Progress */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900">
                      Checkout
                    </h1>
                    <p className="text-amber-700 text-xs sm:text-sm">
                      Complete your order details
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <ProgressTracker currentStep="checkout" />
                </div>

                {/* Back to Cart */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/cart')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Cart</span>
                  <span className="sm:hidden">Cart</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 p-3 sm:p-4 md:p-6">
            {/* Checkout Form */}
            <div className="flex-1 space-y-6">
              {/* Shipping Address Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-amber-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </h2>
                  <div className="flex items-center gap-2">
                    {addressConfirmed && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Display (replace with editable fields) */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700 w-full">
                      <p className="font-medium text-gray-900 mb-1">
                        {user?.fullName}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(
                          [
                            ['street', 'Street Address'],
                            ['city', 'City/Municipality'],
                            ['province', 'Province'],
                            ['postalCode', 'Postal Code'],
                            ['country', 'Country'],
                          ] as const
                        ).map(([key, label]) => (
                          <div key={key} className="space-y-1">
                            <label className="block text-xs font-medium text-gray-600">
                              {label}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={address[key as keyof typeof address]}
                              onChange={(e) =>
                                setAddress((prev) => ({
                                  ...prev,
                                  [key as keyof typeof address]: e.target.value,
                                }))
                              }
                              placeholder={`Enter ${label.toLowerCase()}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      {user?.mobileNumber && (
                        <p className="text-gray-600 mt-2 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.mobileNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="space-y-3">
                  {/* Map Toggle Button */}
                  {isLoaded && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMap(!showMap)}
                      className="w-full p-3 border border-amber-200 rounded-lg hover:bg-amber-50 transition-all text-sm font-medium text-amber-700 flex items-center justify-center gap-2"
                    >
                      {showMap ? (
                        <>
                          <Crosshair className="w-4 h-4" />
                          Hide Map
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4" />
                          Confirm Address with Map
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Current Location Button */}
                  {showMap && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={getUserLocation}
                      className="w-full p-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium text-blue-700 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Use My Current Location
                    </motion.button>
                  )}
                </div>

                {/* Map Selector */}
                <AnimatePresence>
                  {isLoaded && showMap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <GoogleMapSelector
                        userLocation={userLocation}
                        markerPosition={markerPosition}
                        setMarkerPosition={handleMarkerPositionChange}
                        mapRef={mapRef}
                        setMapRef={setMapRef}
                        reverseGeocode={reverseGeocode}
                        showSearch={showSearch}
                        setShowSearch={setShowSearch}
                        onClose={() => setShowMap(false)}
                        isLoaded={isLoaded}
                        loadError={loadError}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address Confirmation Notice */}
                {addressConfirmed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-green-800">
                        <p className="font-medium mb-1">Address Confirmed</p>
                        <p>
                          Your shipping address has been verified and updated
                          from the map selection.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Payment Method Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      value: 'cod',
                      label: 'Cash on Delivery',
                      icon: Truck,
                      description: 'Pay when you receive your order',
                    },
                    {
                      value: 'online banking',
                      label: 'Online Banking',
                      icon: Shield,
                      description: 'Secure online payment via Xendit',
                    },
                  ].map((method) => (
                    <motion.label
                      key={method.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.value
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <method.icon className="w-4 h-4 text-amber-600" />
                          <span className="font-medium text-gray-900">
                            {method.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </motion.label>
                  ))}
                </div>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-green-800">
                      <p className="font-medium mb-1">Secure Payment</p>
                      <p>Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-24 bg-white rounded-xl border border-amber-200/60 shadow-lg p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-amber-700 ml-2">
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-amber-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-amber-100 pt-2">
                    <div className="flex justify-between text-base font-bold text-amber-900">
                      <span>Total</span>
                      <span>{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Truck className="w-3 h-3" />
                    <span className="font-medium">Delivery Information</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>• Estimated delivery: 2-3 business days</p>
                    <p>• Free shipping on all orders</p>
                    <p>• Cash on delivery available</p>
                  </div>
                </div>

                {/* Place Order Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </div>
                  ) : (
                    `Place Order - ${totalAmount.toFixed(2)}`
                  )}
                </motion.button>

                {/* Terms */}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  By placing your order, you agree to our{' '}
                  <a href="#" className="text-amber-600 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

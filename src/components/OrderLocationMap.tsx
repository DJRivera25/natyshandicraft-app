'use client';

import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderLocationMapProps {
  location: {
    lat: number;
    lng: number;
    formattedAddress?: string;
  };
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  orderId: string;
}

export default function OrderLocationMap({
  location,
  address,
  orderId,
}: OrderLocationMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
        <div className="flex items-center gap-2 text-red-700">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Failed to load map</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-amber-200/40 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-200/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" />
              Order Location
            </h3>
          </div>
          <span className="text-xs text-blue-600 font-medium">
            #{orderId.slice(-6)}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-48">
        <GoogleMap
          center={location}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          <Marker
            position={location}
            icon={{
              url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="#3B82F6"/>
                  <circle cx="12" cy="12" r="6" fill="white"/>
                  <circle cx="12" cy="12" r="3" fill="#3B82F6"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 32),
              anchor: new google.maps.Point(12, 32),
            }}
          />
        </GoogleMap>
      </div>

      {/* Address Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">
            {location.formattedAddress ||
              `${address.street}, ${[address.city].filter(Boolean).join(', ')}`}
          </p>
          <p className="text-xs text-gray-600">
            {address.province}, {address.postalCode}, {address.country}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetDirections}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenInMaps}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open Map
          </motion.button>
        </div>

        {/* Coordinates */}
        <div className="text-xs text-gray-500 text-center">
          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </div>
      </div>
    </motion.div>
  );
}

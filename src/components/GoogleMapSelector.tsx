// components/GoogleMapSelector.tsx
'use client';

import {
  Autocomplete,
  Circle,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';
import {
  LocateFixed,
  Search,
  X,
  MapPin,
  Navigation,
  Crosshair,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  userLocation: google.maps.LatLngLiteral | null;
  markerPosition: google.maps.LatLngLiteral;
  setMarkerPosition: (pos: google.maps.LatLngLiteral) => void;
  mapRef: google.maps.Map | null;
  setMapRef: (map: google.maps.Map | null) => void;
  reverseGeocode: (lat: number, lng: number) => void;
  showSearch: boolean;
  setShowSearch: (val: boolean) => void;
  onClose: () => void;
  isLoaded: boolean;
  loadError: unknown;
}

const GoogleMapSelector: React.FC<Props> = ({
  userLocation,
  markerPosition,
  setMarkerPosition,
  mapRef,
  setMapRef,
  reverseGeocode,
  showSearch,
  setShowSearch,
  onClose,
  isLoaded,
  loadError,
}) => {
  const [pulseRadius, setPulseRadius] = useState(20);
  const [pulseOpacity, setPulseOpacity] = useState(0.2);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    let growing = true;
    const interval = setInterval(() => {
      setPulseRadius((prev) => {
        if (growing && prev >= 40) growing = false;
        else if (!growing && prev <= 20) growing = true;
        return growing ? prev + 1 : prev - 1;
      });

      setPulseOpacity((prev) =>
        growing ? Math.min(prev + 0.01, 0.4) : Math.max(prev - 0.01, 0.1)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

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

  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMarkerPosition(current);
          mapRef?.panTo(current);
          reverseGeocode(current.lat, current.lng);
          setIsLoadingLocation(false);
        },
        () => {
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  // Show loading state while Google Maps API is loading
  if (!isLoaded) {
    return (
      <div className="relative w-full mb-6 rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b border-amber-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                Location Selector
              </h3>
            </div>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all"
            >
              <X className="h-4 w-4 text-gray-600" />
            </motion.button>
          </div>
        </div>
        <div className="h-80 sm:h-96 w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if Google Maps API failed to load
  if (loadError) {
    return (
      <div className="relative w-full mb-6 rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b border-amber-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                Location Selector
              </h3>
            </div>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all"
            >
              <X className="h-4 w-4 text-gray-600" />
            </motion.button>
          </div>
        </div>
        <div className="h-80 sm:h-96 w-full flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Map loading failed
              </p>
              <p className="text-xs text-gray-600">
                Please check your internet connection and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mb-6 rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 border-b border-amber-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-600" />
              Location Selector
            </h3>
          </div>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all"
          >
            <X className="h-4 w-4 text-gray-600" />
          </motion.button>
        </div>
        <p className="text-xs text-amber-700 mt-1">
          Search for an address or click on the map to set your location
        </p>
      </div>

      {/* Map Container */}
      <div className="relative h-80 sm:h-96 w-full">
        {/* Search Input */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-3 right-3 z-20"
            >
              <Autocomplete
                onLoad={(auto) => {
                  autocompleteRef.current = auto;
                  auto.addListener('place_changed', onPlaceChanged);
                }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for your address..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl shadow-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm"
                  />
                </div>
              </Autocomplete>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Buttons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {/* Search Toggle */}
          <motion.button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all border border-gray-200"
          >
            {showSearch ? (
              <X className="h-4 w-4 text-gray-600" />
            ) : (
              <Search className="h-4 w-4 text-amber-600" />
            )}
          </motion.button>

          {/* Current Location */}
          <motion.button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLoadingLocation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all border border-gray-200 disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4 text-amber-600" />
            )}
          </motion.button>
        </div>

        {/* Map */}
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
          {/* Pulsating User Location */}
          {userLocation && (
            <>
              <Circle
                center={userLocation}
                radius={6}
                options={{
                  strokeColor: '#3B82F6',
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  fillColor: '#3B82F6',
                  fillOpacity: 1,
                  zIndex: 101,
                }}
              />
              <Circle
                center={userLocation}
                radius={pulseRadius}
                options={{
                  strokeColor: '#3B82F6',
                  strokeOpacity: pulseOpacity,
                  strokeWeight: 1,
                  fillColor: '#3B82F6',
                  fillOpacity: pulseOpacity * 0.3,
                  zIndex: 100,
                }}
              />
            </>
          )}

          {/* Pin Marker */}
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
            icon={{
              url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="#EF4444"/>
                  <circle cx="12" cy="12" r="6" fill="white"/>
                  <circle cx="12" cy="12" r="3" fill="#EF4444"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 32),
              anchor: new google.maps.Point(12, 32),
            }}
          />
        </GoogleMap>

        {/* Instructions Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Crosshair className="w-3 h-3 text-amber-500" />
              <span>
                Drag the marker or click on the map to set your location
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Navigation className="w-3 h-3 text-amber-500" />
            <span>Selected Location</span>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-800">
              {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapSelector;

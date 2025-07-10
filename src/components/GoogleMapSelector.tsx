// components/GoogleMapSelector.tsx
'use client';

import {
  Autocomplete,
  Circle,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';
import { LocateFixed, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
}) => {
  const [pulseRadius, setPulseRadius] = useState(20);
  const [pulseOpacity, setPulseOpacity] = useState(0.2);
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

  return (
    <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden border border-gray-300 z-20">
      <label className="block text-sm font-medium text-amber-800 mb-2 px-1 pt-1">
        Search or Pin your Location
      </label>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-0 right-3 z-30 bg-amber-500 p-2 rounded-full shadow hover:bg-amber-600"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Current Location Button */}
      <button
        type="button"
        onClick={() => {
          if (userLocation) {
            mapRef?.panTo(userLocation);
            setMarkerPosition(userLocation);
            reverseGeocode(userLocation.lat, userLocation.lng);
          }
        }}
        className="absolute bottom-3 left-2 z-30 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        <LocateFixed className="h-5 w-5 text-amber-600" />
      </button>

      {/* Search Input */}
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
            className="absolute top-22 left-2 sm:left-46 z-20 w-[calc(100%-2rem)] sm:w-[calc(80%-5rem)] max-w-md rounded-md border border-gray-300 bg-white px-4 py-2 shadow-md focus:border-amber-500 focus:ring-amber-200"
          />
        </Autocomplete>
      )}

      {/* Search Toggle */}
      <button
        type="button"
        onClick={() => setShowSearch(!showSearch)}
        className="absolute top-11 left-50 sm:left-46 z-30 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        {showSearch ? (
          <X className="h-5 w-5" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </button>

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
      >
        {/* Pulsating User Location */}
        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={6}
              options={{
                strokeColor: '#4285F4',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#4285F4',
                fillOpacity: 1,
                zIndex: 101,
              }}
            />
            <Circle
              center={userLocation}
              radius={pulseRadius}
              options={{
                strokeColor: '#4285F4',
                strokeOpacity: pulseOpacity,
                strokeWeight: 1,
                fillColor: '#4285F4',
                fillOpacity: pulseOpacity,
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
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapSelector;

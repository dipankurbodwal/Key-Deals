import React, { useEffect, useRef, useState } from 'react';
import { Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { GeoPoint } from '../types';
import { Crosshair, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';

interface LocationPickerProps {
  value: GeoPoint | null;
  onChange: (point: GeoPoint) => void;
  onAddressChange?: (address: string) => void;
}

export function LocationPicker({ value, onChange, onAddressChange }: LocationPickerProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [markerPosition, setMarkerPosition] = useState<GeoPoint | null>(value);
  const [isLocating, setIsLocating] = useState(false);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  const reverseGeocode = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        if (onAddressChange) {
          onAddressChange(results[0].formatted_address);
        }
      }
    });
  };

  const handleCaptureLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setMarkerPosition(newPos);
        onChange(newPos);
        reverseGeocode(newPos.lat, newPos.lng);
        
        if (map) {
          map.panTo(newPos);
          map.setZoom(17);
        }
        setIsLocating(false);
      },
      (error) => {
        alert('Unable to retrieve your location. Please check permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!placesLib || !autocompleteRef.current) return;

    const options = {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false,
    };

    const autocomplete = new placesLib.Autocomplete(autocompleteRef.current, options);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const newPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setMarkerPosition(newPos);
      onChange(newPos);
      if (onAddressChange && place.formatted_address) {
        onAddressChange(place.formatted_address);
      }

      if (map) {
        map.panTo(newPos);
        map.setZoom(17);
      }
    });
  }, [placesLib, map, onChange, onAddressChange]);

  useEffect(() => {
    if (value) {
      setMarkerPosition(value);
    }
  }, [value]);

  const handleMapClick = (e: any) => {
    if (e.detail.latLng) {
      const newPos = {
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng
      };
      setMarkerPosition(newPos);
      onChange(newPos);
      reverseGeocode(newPos.lat, newPos.lng);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={autocompleteRef}
            type="text"
            placeholder="Search for an address..."
            className="w-full px-4 py-2 rounded-xl border border-keydeals-border focus:ring-2 focus:ring-keydeals-action bg-white text-keydeals-text-secondary"
          />
        </div>
        <button
          type="button"
          onClick={handleCaptureLocation}
          disabled={isLocating}
          className="flex items-center gap-2 bg-keydeals-action text-white px-4 py-2 rounded-xl font-bold hover:bg-keydeals-action/90 transition-colors shadow-sm disabled:opacity-70 shrink-0"
          title="Capture Current Location"
        >
          <Crosshair className={cn("w-5 h-5", isLocating && "animate-spin")} />
          <span className="hidden sm:inline">Capture Location</span>
        </button>
      </div>
      <div className="h-64 rounded-xl overflow-hidden border border-keydeals-border shadow-inner">
        <Map
          defaultCenter={value || { lat: 28.8955, lng: 76.6066 }}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
        >
          {markerPosition && (
            <AdvancedMarker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                  setMarkerPosition(newPos);
                  onChange(newPos);
                  reverseGeocode(newPos.lat, newPos.lng);
                }
              }}
            >
              <Pin background="#4285F4" glyphColor="#fff" />
            </AdvancedMarker>
          )}
        </Map>
      </div>
      <p className="text-xs text-keydeals-text-secondary/60 italic">
        Tip: Search for an address, click "Capture Location", or click on the map to set the exact location. You can also drag the marker.
      </p>
    </div>
  );
}

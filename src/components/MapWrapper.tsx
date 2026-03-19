import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MapComponent } from './MapComponent';
import { MapFallback } from './MapFallback';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MapWrapperProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    type?: 'property' | 'rental';
  }>;
  onMarkerClick?: (id: string) => void;
}

export function MapWrapper(props: MapWrapperProps) {
  if (!hasValidKey) {
    return <MapFallback />;
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <MapComponent {...props} />
    </APIProvider>
  );
}

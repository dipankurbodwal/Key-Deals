import React from 'react';
import { MapWrapper } from './MapWrapper';
import { useProperties } from '../context/PropertyContext';

export function RentalMap() {
  const { properties } = useProperties();
  
  // Filter for properties for rent
  const rentProperties = properties.filter(p => p.purpose === 'Rent');
  
  // Default center (Rohtak as requested)
  const defaultCenter = { lat: 28.8955, lng: 76.6066 };
  
  const markers = rentProperties.map(p => ({
    id: p.id,
    position: p.geopoint || { lat: 28.8955, lng: 76.6066 },
    title: p.title,
    type: 'rental' as const
  }));

  return (
    <div className="w-full h-[400px] mb-6">
      <MapWrapper 
        center={defaultCenter} 
        zoom={12} 
        markers={markers} 
      />
    </div>
  );
}

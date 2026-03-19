import React from 'react';
import { MapWrapper } from './MapWrapper';
import { useProperties } from '../context/PropertyContext';

export function PropertyMap() {
  const { properties } = useProperties();
  
  // Filter for properties for sale
  const saleProperties = properties.filter(p => p.purpose === 'Sale');
  
  // Default center (Rohtak as requested)
  const defaultCenter = { lat: 28.8955, lng: 76.6066 };
  
  const markers = saleProperties.map(p => ({
    id: p.id,
    position: p.geopoint || { lat: 28.8955, lng: 76.6066 },
    title: p.title,
    type: 'property' as const
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

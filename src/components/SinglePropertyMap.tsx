import React from 'react';
import { MapWrapper } from './MapWrapper';
import { Property } from '../types';

interface SinglePropertyMapProps {
  property: Property;
}

export function SinglePropertyMap({ property }: SinglePropertyMapProps) {
  const marker = {
    id: property.id,
    position: property.geopoint || { lat: 28.8955, lng: 76.6066 },
    title: property.title,
    type: property.purpose === 'Rent' ? ('rental' as const) : ('property' as const)
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <MapWrapper 
        center={marker.position} 
        zoom={15} 
        markers={[marker]} 
      />
    </div>
  );
}

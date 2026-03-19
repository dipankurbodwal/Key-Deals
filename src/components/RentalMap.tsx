import React, { useEffect, useState } from 'react';
import { MapWrapper } from './MapWrapper';
import { useProperties } from '../context/PropertyContext';

export function RentalMap() {
  const { properties, globalLocation } = useProperties();
  const [center, setCenter] = useState({ lat: 28.8955, lng: 76.6066 }); // Fallback to Rohtak
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback already set to Rohtak
        }
      );
    }
  }, []);
  
  // Filter for properties for rent and matching city if not "All India"
  const rentProperties = properties.filter(p => {
    const matchesPurpose = p.purpose === 'Rent';
    const matchesLocation = globalLocation === 'All India' || p.city === globalLocation;
    return matchesPurpose && matchesLocation;
  });
  
  const markers = rentProperties.map(p => ({
    id: p.id,
    position: p.geopoint || { lat: 28.8955, lng: 76.6066 },
    title: p.title,
    type: 'rental' as const
  }));

  return (
    <div className="w-full h-[400px] mb-6">
      <MapWrapper 
        center={center} 
        zoom={12} 
        markers={markers} 
      />
    </div>
  );
}

import React from 'react';
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

interface MapProps {
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

export function MapComponent({ center, zoom, markers, onMarkerClick }: MapProps) {
  const map = useMap();

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-md border border-black/5">
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        {markers.map((marker) => (
          <AdvancedMarker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            onClick={() => onMarkerClick?.(marker.id)}
          >
            <Pin 
              background={marker.type === 'rental' ? "#10b981" : "#4285F4"} 
              glyphColor="#fff" 
            />
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}

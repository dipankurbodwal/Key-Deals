import React from 'react';

export function MapFallback() {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
  const isMissingKey = !API_KEY || API_KEY === 'YOUR_API_KEY';

  return (
    <div className="w-full h-full min-h-[300px] bg-slate-100 rounded-xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-300">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <h3 className="text-slate-900 font-semibold mb-1">
        {isMissingKey ? 'Google Maps API Key Required' : 'Map Loading...'}
      </h3>
      <p className="text-slate-500 text-sm max-w-[280px]">
        {isMissingKey 
          ? 'Please add your VITE_GOOGLE_MAPS_API_KEY in the settings to enable map features.' 
          : 'The map is initializing. Please wait a moment.'}
      </p>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, Search, Plus, MapPin, Building2, Bed, Bath, Maximize2, IndianRupee } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { cn } from '../lib/utils';
import { RentalMap } from '../components/RentalMap';

export function Rentals() {
  const navigate = useNavigate();
  const { properties, globalLocation } = useProperties();
  
  const rentalProperties = properties.filter(p => 
    p.purpose === 'Rent' && 
    (globalLocation === 'All India' || p.city === globalLocation)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rental Hub</h1>
          <p className="text-slate-500 mt-1">Find your perfect home or commercial space for rent in {globalLocation}.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/rentals/search')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-sm"
          >
            <Search className="w-5 h-5" /> Search for Rent
          </button>
          <button 
            onClick={() => navigate('/rentals/add')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" /> Post for Rent
          </button>
        </div>
      </div>

      {/* Stats/Quick Links */}
      <RentalMap />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Rentals</p>
            <p className="text-2xl font-bold text-slate-900">{rentalProperties.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Commercial</p>
            <p className="text-2xl font-bold text-slate-900">
              {rentalProperties.filter(p => ['Commercial space', 'Shop', 'Office space', 'Co-working Space', 'Warehouse', 'Farm Land'].includes(p.type)).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <Bed className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Residential</p>
            <p className="text-2xl font-bold text-slate-900">
              {rentalProperties.filter(p => ['Residential House', 'Flat/Apartment', 'P.G', 'Residential Plot'].includes(p.type)).length}
            </p>
          </div>
        </div>
      </div>

      {/* Property Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rentalProperties.length > 0 ? (
          rentalProperties.map((property) => (
            <div 
              key={property.id} 
              onClick={() => navigate(`/property/${property.id}`)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="relative h-56">
                <img 
                  src={property.images[0] || 'https://picsum.photos/seed/' + property.id + '/800/600'} 
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">FOR RENT</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <p className="text-lg font-black text-slate-900">₹{property.price}<span className="text-sm font-normal text-slate-500">/month</span></p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{property.location}, {property.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Bed className="w-4 h-4" />
                    <span className="text-sm font-semibold">{property.floors?.ground?.bedrooms || 0} Bed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm font-semibold">{property.floors?.ground?.washrooms || 0} Bath</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">{property.plotAreaSqYd || property.builtUpAreaSqFt} sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{property.type}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${property.id}`);
                    }}
                    className="text-blue-600 font-bold text-sm hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Handshake className="w-10 h-10 text-slate-300" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold text-slate-900">No rentals found in {globalLocation}</h3>
              <p className="text-slate-500 mt-2">Try changing the location or be the first to post a rental property here!</p>
            </div>
            <button 
              onClick={() => navigate('/rentals/add')}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Post a Rental Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

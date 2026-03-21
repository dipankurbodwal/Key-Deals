import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Search, MapPin, Building2, IndianRupee, Globe, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PropertyMap } from '../components/PropertyMap';

export function Market() {
  const { properties, globalLocation, user } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const isOwner = user?.role === 'Owner' || user?.role === 'Property Owner';

  const marketplaceProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.landmark?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Global Location Match
    if (globalLocation !== 'All India' && p.city !== globalLocation) {
      return false;
    }

    return p.is_published;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#002366]" /> Marketplace
          </h1>
          <p className="text-slate-500 mt-1">Discover direct owner properties in {globalLocation}.</p>
        </div>
        {isOwner && (
          <button 
            onClick={() => navigate('/add-property')}
            className="flex items-center gap-2 px-6 py-3 bg-[#002366] text-white rounded-xl font-bold hover:bg-[#002366]/90 transition-all shadow-lg shadow-[#002366]/20"
          >
            <Key className="w-5 h-5" />
            Add Property
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search marketplace..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#002366] outline-none shadow-sm"
          />
        </div>

        <PropertyMap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {marketplaceProperties.length > 0 ? (
          marketplaceProperties.map((property) => (
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
                  <span className="px-3 py-1 bg-[#002366] text-white text-xs font-bold rounded-full shadow-lg uppercase">Direct Owner</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <p className="text-lg font-black text-slate-900">₹{property.price}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{property.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-medium">{property.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-xs font-medium">{property.purpose}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No properties found in Marketplace</h3>
            <p className="text-slate-500">Try adjusting your search or location.</p>
          </div>
        )}
      </div>
    </div>
  );
}

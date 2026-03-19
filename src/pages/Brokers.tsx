import React from 'react';
import { Phone, MessageSquare, MapPin, Building2, User as UserIcon, Search } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { cn } from '../lib/utils';

export function Brokers() {
  const { brokers, globalLocation } = useProperties();

  const filteredBrokers = brokers.filter(broker => 
    globalLocation === 'All India' || broker.city === globalLocation
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Broker Directory</h1>
          <p className="text-slate-500 mt-1">Connect with professional brokers in {globalLocation}.</p>
        </div>
      </div>

      {filteredBrokers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrokers.map((broker) => (
            <div key={broker.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex gap-2">
                  <a 
                    href={`tel:${broker.businessProfile?.contactNumber || broker.phone}`}
                    className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a 
                    href={`https://wa.me/${broker.businessProfile?.contactNumber || broker.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{broker.businessProfile?.companyName || 'Independent Broker'}</h3>
                <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span>{broker.businessProfile?.contactPerson || broker.name}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                  <span>{broker.address || broker.city || 'Address not provided'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a 
                  href={`tel:${broker.businessProfile?.contactNumber || broker.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a 
                  href={`https://wa.me/${broker.businessProfile?.contactNumber || broker.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900">No brokers here yet</h3>
            <p className="text-slate-500 mt-2">Be the first to list your business in {globalLocation}!</p>
          </div>
          <button 
            onClick={() => window.location.href = '/onboarding'}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Register as Broker
          </button>
        </div>
      )}
    </div>
  );
}

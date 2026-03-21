import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Users, MapPin, Phone, MessageCircle, Lock, Search, Filter, Calendar, IndianRupee } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export function RentalLeads() {
  const { publicLeads, user, subscribeToMarketplace, adminSettings } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const rentalLeads = publicLeads.filter(l => 
    l.clientRequirements?.purpose === 'On Rent' &&
    (l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     l.clientRequirements?.landmarks.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isSubscribed = user?.isSubscribed;

  const handleSubscribe = () => {
    // In a real app, this would redirect to Stripe
    const confirm = window.confirm(`Subscribe to Marketplace for ₹${adminSettings.marketplaceSubscriptionAmount} to unlock all lead contacts for 15 days?`);
    if (confirm) {
      subscribeToMarketplace();
      alert('Subscription successful! All leads are now unlocked.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-keydeals-text-primary tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-700" /> Rental Leads
          </h1>
          <p className="text-keydeals-text-secondary mt-1">Public board for clients looking for rental properties.</p>
        </div>
        
        {!isSubscribed && (
          <button 
            onClick={handleSubscribe}
            className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20 scale-105"
          >
            <Lock className="w-5 h-5" />
            Subscribe to Unlock (₹{adminSettings.marketplaceSubscriptionAmount})
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
          <input
            type="text"
            placeholder="Search by name or landmark..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-keydeals-border bg-keydeals-surface focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-keydeals-surface border border-keydeals-border rounded-2xl font-bold text-keydeals-text-primary hover:bg-white/50 transition-colors">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentalLeads.map((lead) => (
          <div key={lead.id} className="bg-keydeals-surface rounded-3xl border border-keydeals-border shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                    {lead?.name?.charAt(0) || 'L'}
                  </div>
                  <div>
                    <h3 className="font-bold text-keydeals-text-primary">{lead?.name || 'Lead'}</h3>
                    <div className="flex items-center gap-1 text-xs text-keydeals-text-secondary">
                      <Calendar className="w-3 h-3" />
                      {lead?.clientRequirements?.postedAt ? new Date(lead.clientRequirements.postedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">
                  Rent
                </span>
              </div>

              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-sm text-keydeals-text-secondary">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span className="font-medium">{lead?.clientRequirements?.landmarks || 'N/A'}, {lead?.clientRequirements?.location || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-keydeals-text-secondary">
                  <Users className="w-4 h-4 text-blue-700" />
                  <span className="font-medium">{lead?.clientRequirements?.propertyType || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-keydeals-text-secondary">
                  <IndianRupee className="w-4 h-4 text-blue-700" />
                  <span className="font-bold text-blue-700">₹{lead?.clientRequirements?.budgetMin?.toLocaleString() || '0'} - ₹{lead?.clientRequirements?.budgetMax?.toLocaleString() || '0'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-keydeals-border grid grid-cols-2 gap-3">
                <button 
                  disabled={!isSubscribed}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                    isSubscribed 
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isSubscribed ? (
                    <>
                      <Phone className="w-4 h-4" />
                      Call
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Locked
                    </>
                  )}
                </button>
                <button 
                  disabled={!isSubscribed}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                    isSubscribed 
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isSubscribed ? (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Locked
                    </>
                  )}
                </button>
              </div>
              
              {!isSubscribed && (
                <div className="mt-2 text-center">
                  <p className="text-[10px] text-slate-400 font-medium italic">Subscribe to unlock contact details</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {rentalLeads.length === 0 && (
        <div className="text-center py-20 bg-keydeals-surface rounded-3xl border border-dashed border-keydeals-border">
          <Users className="w-16 h-16 text-keydeals-text-secondary/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-keydeals-text-primary">No rental leads found</h3>
          <p className="text-keydeals-text-secondary mt-2">Try adjusting your search or check back later.</p>
        </div>
      )}
    </div>
  );
}

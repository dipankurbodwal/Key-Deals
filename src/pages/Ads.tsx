import React, { useState } from 'react';
import { Megaphone, Plus, MapPin, Building2, Phone, MessageSquare, Search, X, CreditCard, Navigation } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { cn } from '../lib/utils';
import { Advertisement } from '../types';
import { APIProvider } from '@vis.gl/react-google-maps';
import { LocationPicker } from '../components/LocationPicker';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export function Ads() {
  const { advertisements, globalLocation, addAdvertisement, user } = useProperties();
  const [showPostModal, setShowPostModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const filteredAds = advertisements.filter(ad => 
    globalLocation === 'All India' || ad.city === globalLocation
  );

  const [newAd, setNewAd] = useState<Partial<Advertisement>>({
    title: '',
    developerName: '',
    description: '',
    city: globalLocation === 'All India' ? '' : globalLocation,
    address: '',
    priceRange: '',
    contactNumber: '',
    whatsappNumber: '',
    geopoint: undefined,
  });

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const ad: Advertisement = {
      id: `ad-${Date.now()}`,
      title: newAd.title!,
      developerName: newAd.developerName!,
      description: newAd.description!,
      city: newAd.city!,
      address: newAd.address,
      geopoint: newAd.geopoint,
      image: 'https://picsum.photos/seed/' + Date.now() + '/800/600',
      priceRange: newAd.priceRange!,
      contactNumber: newAd.contactNumber!,
      whatsappNumber: newAd.whatsappNumber!,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isPaid: true,
    };
    
    await addAdvertisement(ad);
    setIsProcessing(false);
    setShowPostModal(false);
    alert('Ad posted successfully! Subscription of ₹1000 for 1 month has been activated.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Builder Projects</h1>
          <p className="text-slate-500 mt-1">Premium advertisements from top developers in {globalLocation}.</p>
        </div>
        <button 
          onClick={() => setShowPostModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" /> Post Project Ad
        </button>
      </div>

      {filteredAds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredAds.map((ad) => (
            <div key={ad.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-64">
                <img 
                  src={ad.image} 
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">FEATURED PROJECT</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-slate-900">{ad.title}</h3>
                    <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
                      <Building2 className="w-4 h-4" />
                      <span>{ad.developerName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-slate-600 line-clamp-2">{ad.description}</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {ad.city}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    {ad.priceRange}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <a 
                    href={`tel:${ad.contactNumber}`}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call Developer
                  </a>
                  <a 
                    href={`https://wa.me/${ad.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Megaphone className="w-10 h-10 text-slate-300" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900">No projects listed in {globalLocation}</h3>
            <p className="text-slate-500 mt-2">Be the first to showcase your project to thousands of potential buyers!</p>
          </div>
          <button 
            onClick={() => setShowPostModal(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Post Your Project
          </button>
        </div>
      )}

      {/* Post Ad Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white shrink-0">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                <h2 className="text-xl font-bold">Post Project Advertisement</h2>
              </div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form id="post-ad-form" onSubmit={handlePostAd} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900">Subscription Fee: ₹1000</p>
                    <p className="text-xs text-blue-700">Valid for 30 days across {globalLocation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                    <input required type="text" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Royal Residency" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Developer Name</label>
                    <input required type="text" value={newAd.developerName} onChange={e => setNewAd({...newAd, developerName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Royal Builders" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input required type="text" value={newAd.city} onChange={e => setNewAd({...newAd, city: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Rohtak" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price Range</label>
                      <input required type="text" value={newAd.priceRange} onChange={e => setNewAd({...newAd, priceRange: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="e.g. 50 Lacs - 1 Cr" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Address</label>
                    <input required type="text" value={newAd.address} onChange={e => setNewAd({...newAd, address: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="Full project address" />
                  </div>

                  <div className="pt-2 space-y-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">GPS Coordinates & Map Picker</label>
                    
                    {hasValidKey ? (
                      <APIProvider apiKey={API_KEY} version="weekly">
                        <LocationPicker 
                          value={newAd.geopoint || null} 
                          onChange={(point) => setNewAd({ ...newAd, geopoint: point })}
                          onAddressChange={(address) => setNewAd({ ...newAd, address: address })}
                        />
                      </APIProvider>
                    ) : (
                      <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                        <p className="text-slate-500 font-medium">Google Maps API Key required for Geo-Capture System.</p>
                        <p className="text-xs text-slate-400 mt-1">Please add GOOGLE_MAPS_PLATFORM_KEY in Settings &gt; Secrets.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea required value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 h-24" placeholder="Brief details about the project..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                      <input required type="tel" value={newAd.contactNumber} onChange={e => setNewAd({...newAd, contactNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="9876543210" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                      <input required type="tel" value={newAd.whatsappNumber} onChange={e => setNewAd({...newAd, whatsappNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="9876543210" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brochures & Pamphlets (Optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-blue-400 transition-colors cursor-pointer">
                      <div className="space-y-1 text-center">
                        <Plus className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                          <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            Upload images
                          </span>
                          <p className="pl-1">for brochures and pamphlets</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
              <button 
                type="submit" 
                form="post-ad-form"
                disabled={isProcessing}
                className={cn(
                  "w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2",
                  isProcessing && "opacity-70 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Pay ₹1000 & Post Ad"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

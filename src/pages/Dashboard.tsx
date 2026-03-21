import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, MapPin, Landmark, User, Globe, Image as ImageIcon, Phone, MessageCircle, Navigation, Store, Lock, Calculator, Home, Handshake, Users, IndianRupee, MessageSquare } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Property, PropertyStatus, Lead } from '../types';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { PropertyMap } from '../components/PropertyMap';

export function Dashboard() {
  const { 
    properties, 
    updatePropertyStatus, 
    updateProperty, 
    mode, 
    user, 
    activeClient, 
    setActiveClient, 
    leads, 
    globalLocation, 
    adminSettings,
    publicLeads,
    unlockProperty
  } = useProperties();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUnlockContact = (property: Property) => {
    // If property is from an Owner, it requires a per-lead fee for Brokers
    if (property.quotedBy === 'Owner' && user?.role === 'Broker') {
      const isUnlocked = user.unlockedProperties?.includes(property.id);
      
      if (!isUnlocked) {
        const confirm = window.confirm(`To view this Property Owner's contact details, a one-time Lead Fee of ₹${adminSettings.leadUnlockFee} is required. Unlock now?`);
        if (confirm) {
          unlockProperty(property.id);
          alert('Contact details unlocked successfully!');
        }
        return;
      }
    }

    // If marketplace subscription is enabled and user is not subscribed, redirect to subscription
    // (This part might still apply for other cases or if we want to keep it as a general rule)
    if (adminSettings.marketplaceSubscriptionEnabled && !user?.isSubscribed && property.quotedBy === 'Owner' && user?.role !== 'Broker') {
      alert(`To view direct owner contact details, please pay the Marketplace Access Fee of ₹${adminSettings.marketplaceSubscriptionAmount}.`);
      navigate('/subscription');
      return;
    }
    
    // Otherwise, show contact details
    alert(`Contact details unlocked!\nPhone: ${property.phoneNumber}\nWhatsApp: ${property.whatsappNumber}`);
  };

  const handleMarketplace = (e: React.MouseEvent, property: Property) => {
    e.preventDefault();
    if (!user?.isSubscribed) {
      alert('Please subscribe to publish properties to the Marketplace.');
      navigate('/subscription');
      return;
    }
    updateProperty({ ...property, is_published: !property.is_published });
  };

  const calculateMatchScore = (property: Property, client: Lead | null) => {
    if (!client) return null;
    let score = 0;
    let totalWeight = 0;

    // Budget Match (Weight: 40)
    if (client.budgetMax) {
      totalWeight += 40;
      score += 35; 
    }

    // Location Match (Weight: 30)
    if (client.location) {
      totalWeight += 30;
      if (property.location?.toLowerCase()?.includes(client.location?.toLowerCase() || '')) {
        score += 30;
      } else {
        score += 10; // Partial match
      }
    }

    // Property Type Match (Weight: 30)
    if (client.purpose) {
      totalWeight += 30;
      if (property.purpose === client.purpose) {
        score += 30;
      }
    }

    if (totalWeight === 0) return null;
    return Math.round((score / totalWeight) * 100);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.landmark?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Global Location Match
    if (globalLocation !== 'All India' && p.city !== globalLocation) {
      return false;
    }

    // Client pre-filtering in Marketplace mode
    if (mode === 'Marketplace' && user?.role === 'Client' && user.clientRequirements) {
      const req = user.clientRequirements;
      
      // Property Type Match
      if (req.propertyType && !p.type?.toLowerCase().includes(req.propertyType.toLowerCase())) {
        return false;
      }

      // Budget Match
      const priceNum = parseInt(p.price?.replace(/\D/g, '') || '0') * (p.price?.toLowerCase().includes('cr') ? 10000000 : p.price?.toLowerCase().includes('lac') ? 100000 : 1);
      if (req.budgetMax && priceNum > req.budgetMax) return false;
      if (req.budgetMin && priceNum < req.budgetMin) return false;

      // Landmark Match (optional/soft)
      if (req.landmarks && !p.landmark?.toLowerCase().includes(req.landmarks.toLowerCase()) && !p.location?.toLowerCase().includes(req.landmarks.toLowerCase())) {
        // We could make this a soft match, but for now let's keep it strict if provided
        // return false; 
      }
    }

    return true;
  });

  const displayedProperties = mode === 'Marketplace' 
    ? filteredProperties.filter(p => p.is_published)
    : filteredProperties.filter(p => p.user_id === user?.id);

  const clientStats = leads.reduce((acc, lead) => {
    const purpose = lead.purpose || 'Other';
    acc[purpose] = (acc[purpose] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inventoryStats = properties.filter(p => p.user_id === user?.id).reduce((acc, p) => {
    const purpose = p.purpose || 'Other';
    acc[purpose] = (acc[purpose] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    acc.published = (acc.published || 0) + (p.is_published ? 1 : 0);
    return acc;
  }, { total: 0, published: 0 } as Record<string, number>);

  // For Owners: Show matching client requirements
  const matchingLeads = user?.role === 'Property Owner' ? publicLeads.filter(lead => {
    if (!lead) return false;
    // Basic matching logic: same city or purpose
    if (globalLocation !== 'All India' && !lead.city?.toLowerCase()?.includes(globalLocation.toLowerCase())) {
      return false;
    }
    return true;
  }) : [];

  const isOwner = user?.role === 'Owner' || user?.role === 'Property Owner';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-keydeals-text-primary tracking-tight">
            {mode === 'Marketplace' ? t('nav.marketplace') : 'Property Inventory'}
          </h1>
          <p className="text-keydeals-text-secondary mt-1 font-medium">
            {mode === 'Marketplace' ? 'Discover premium properties available to the public.' : 'Manage your portfolio and track availability.'}
          </p>
        </div>
        
        {(mode === 'Professionals' || isOwner) && (
          <div className="flex items-center gap-3">
            <Link to="/tools" className="flex items-center gap-2 bg-keydeals-surface text-[#002366] border border-keydeals-border px-6 py-2.5 rounded-xl font-bold hover:bg-white/40 transition-colors shadow-sm text-center whitespace-nowrap">
              <Calculator className="w-5 h-5" />
              Land Calculator
            </Link>
            <Link to="/add-property" className="bg-[#002366] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#002366]/90 transition-colors shadow-sm text-center whitespace-nowrap">
              {t('buttons.addProperty')}
            </Link>
          </div>
        )}
      </div>

      {/* AI Match Score & Search Section */}
      <div className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-[#002366]">
          <Globe className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">AI Client Search</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Client Selection */}
          <div className="flex-1 w-full space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider">
                Select Client
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
                <select
                  value={activeClient?.id || ''}
                  onChange={(e) => {
                    const client = leads.find(l => l.id === e.target.value) || null;
                    setActiveClient(client);
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-[#002366] transition-all appearance-none"
                >
                  <option value="">Select Client</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name} ({lead.purpose || lead.status})</option>
                  ))}
                </select>
              </div>
            </div>

            {activeClient && (
              <div className="bg-white p-4 rounded-xl border border-keydeals-border flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
                <div>
                  <h4 className="font-bold text-keydeals-text-primary">{activeClient.name}</h4>
                  <p className="text-xs text-keydeals-text-secondary mt-1">
                    Purpose: <span className="font-bold text-[#002366]">{activeClient.purpose || activeClient.status}</span>
                  </p>
                </div>
                <Link to={`/leads`} className="text-[#002366] hover:underline text-xs font-bold">Manage Client</Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-[2] w-full space-y-2">
            <label className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-[#002366] transition-all"
              />
            </div>
          </div>
        </div>

        <PropertyMap />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.role === 'Broker' && mode === 'Professionals' && (
          <>
            <div className="bg-white p-6 rounded-3xl border border-keydeals-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#002366]" />
                </div>
                <Link 
                  to="/add-property"
                  className="p-2 bg-[#002366] text-white rounded-xl hover:bg-[#002366]/90 transition-colors shadow-sm"
                  title="Add Property"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-bold text-keydeals-text-primary">My Inventory</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                    {inventoryStats.total} Total
                  </span>
                  <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-600 rounded-lg">
                    {inventoryStats.published} Published
                  </span>
                  {Object.entries(inventoryStats).map(([key, val]) => {
                    if (key === 'total' || key === 'published') return null;
                    return (
                      <span key={key} className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                        {val} {key}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-keydeals-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-700" />
                </div>
                <Link 
                  to="/add-client"
                  className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                  title="Add Client"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-bold text-keydeals-text-primary">My Clients</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(clientStats).map(([key, val]) => (
                    <span key={key} className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                      {val} {key}
                    </span>
                  ))}
                  {leads.length === 0 && (
                    <p className="text-sm text-keydeals-text-secondary">No clients added yet.</p>
                  )}
                </div>
                <Link to="/leads" className="mt-4 block text-sm font-bold text-emerald-600 hover:underline">
                  View all clients →
                </Link>
              </div>
            </div>
          </>
        )}
        <Link 
          to="/rentals"
          className={cn(
            "group p-8 rounded-3xl shadow-xl overflow-hidden relative",
            user?.role === 'Broker' && mode === 'Professionals' ? "bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-200" : "bg-gradient-to-br from-[#002366] to-[#002366]/80 shadow-[#002366]/20 col-span-full"
          )}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">Rental Hub</h2>
              <p className="text-blue-100 text-lg max-w-md">Dedicated ecosystem for owners and tenants. Manage your rentals with ease.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white font-bold group-hover:bg-white/20 transition-all">
                Explore Rentals &rarr;
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Handshake className="w-64 h-64 text-white" />
          </div>
        </Link>
      </div>

      {/* Owner Matching Leads Section */}
      {user?.role === 'Property Owner' && matchingLeads.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-keydeals-text-primary">Direct Client Matches</h2>
                <p className="text-sm text-keydeals-text-secondary">Clients looking for properties like yours in {globalLocation}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Direct Match
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center font-bold text-emerald-700">
                      {lead.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-keydeals-text-primary">{lead.name}</h4>
                      <p className="text-xs text-emerald-600 font-medium">{lead.clientRequirements?.purpose === 'Rent' ? 'Looking to Rent' : 'Looking to Buy'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-keydeals-text-secondary">
                      <MapPin className="w-4 h-4" />
                      <span>{lead.clientRequirements?.location || lead.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-keydeals-text-primary">
                      <IndianRupee className="w-4 h-4" />
                      <span>Budget: ₹{lead.clientRequirements?.budgetMax?.toLocaleString() || 'Any'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <Phone className="w-4 h-4" />
                      <span>{lead.phone}</span>
                    </div>
                    <button 
                      onClick={() => alert(`Contacting ${lead.name}...`)}
                      className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.map(property => {
          const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.geopoint.lat},${property.geopoint.lng}`;
          const whatsappUrl = `https://wa.me/${property.whatsappNumber?.replace(/\D/g, '') || ''}`;
          const callUrl = `tel:${property.phoneNumber?.replace(/\D/g, '') || ''}`;
          
          const matchScore = mode === 'Professionals' ? calculateMatchScore(property, activeClient) : null;

          return (
            <div key={property.id} className="bg-keydeals-surface rounded-2xl border border-keydeals-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              {/* Image Gallery Preview */}
              <div className="relative h-56 bg-white/20 overflow-hidden">
                <img 
                  src={property.images[0] || 'https://picsum.photos/seed/' + property.id + '/800/600'} 
                  alt={property.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm text-keydeals-text-primary">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {property.images.length}
                </div>
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg w-fit",
                    property.purpose === 'Rent' ? "bg-orange-500 text-white" : "bg-[#002366] text-white"
                  )}>
                    FOR {property.purpose === 'Rent' ? 'RENT' : 'SALE'}
                  </span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm w-fit",
                    property.status === 'Available' ? "bg-emerald-100 text-emerald-800" : 
                    property.status === 'Sold' ? "bg-blue-100 text-[#002366]" : "bg-red-100 text-red-800"
                  )}>
                    {property.status}
                  </span>
                  {mode === 'Professionals' && property.is_published && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm bg-purple-100 text-purple-800 w-fit flex items-center gap-1">
                      <Store className="w-3 h-3" /> Published
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-keydeals-text-primary leading-tight line-clamp-1">{property.title}</h3>
                    <span className="inline-block px-2 py-0.5 bg-white/30 text-keydeals-text-secondary text-[10px] font-bold uppercase tracking-wider rounded w-fit">
                      {property.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-keydeals-text-primary whitespace-nowrap ml-2">₹ {property.price}</span>
                    {property.purpose === 'Rent' && <span className="text-[10px] text-keydeals-text-secondary font-bold uppercase">per month</span>}
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-keydeals-text-secondary text-sm mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#002366]" />
                  <span className="line-clamp-2">{property.location}</span>
                </div>

                {/* AI Match Score */}
                {mode === 'Professionals' && activeClient && matchScore !== null && (
                  <div className="mb-4 bg-white/20 p-3 rounded-xl border border-keydeals-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider">{t('aiMatch')}</span>
                      <span className={cn(
                        "text-sm font-bold",
                        matchScore >= 80 ? "text-emerald-700" : matchScore >= 50 ? "text-amber-600" : "text-red-600"
                      )}>{matchScore}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-1.5">
                      <div 
                        className={cn(
                          "h-1.5 rounded-full",
                          matchScore >= 80 ? "bg-emerald-600" : matchScore >= 50 ? "bg-amber-600" : "bg-red-600"
                        )} 
                        style={{ width: `${matchScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {mode === 'Professionals' ? (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <a 
                      href={navUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-white/20 hover:bg-white/40 text-keydeals-text-primary transition-colors border border-keydeals-border"
                      title="Navigate"
                    >
                      <Navigation className="w-4 h-4" />
                      <span className="text-[10px] font-bold">Nav</span>
                    </a>
                    <a 
                      href={callUrl}
                      className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002366] transition-colors border border-blue-100"
                      title="Call Owner"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-[10px] font-bold">Call</span>
                    </a>
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-100"
                      title="WhatsApp Owner"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-[10px] font-bold">Chat</span>
                    </a>
                    <button 
                      onClick={(e) => handleMarketplace(e, property)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors border",
                        property.is_published 
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200" 
                          : "bg-white/20 text-keydeals-text-primary hover:bg-white/40 border-keydeals-border"
                      )}
                      title={property.is_published ? "Remove from Marketplace" : "Publish to Marketplace"}
                    >
                      <Store className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{property.is_published ? 'Unpublish' : 'Publish'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <button 
                      onClick={() => handleUnlockContact(property)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#002366] text-white rounded-xl font-bold hover:bg-[#002366]/90 transition-colors shadow-sm"
                    >
                      <Lock className="w-4 h-4 text-keydeals-surface" /> {t('buttons.unlockContact')}
                    </button>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-keydeals-border flex items-center justify-between">
                  {mode === 'Professionals' ? (
                    <select
                      value={property.status}
                      onChange={(e) => updatePropertyStatus(property.id, e.target.value as PropertyStatus)}
                      className={cn(
                        "text-sm font-bold bg-transparent border-none focus:ring-0 cursor-pointer p-0",
                        property.status === 'Available' ? "text-emerald-700" : 
                        property.status === 'Sold' ? "text-[#002366]" : "text-red-700"
                      )}
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                      <option value="Plan Cancelled">Plan Cancelled</option>
                    </select>
                  ) : (
                    <span className="text-sm font-bold text-keydeals-text-secondary">ID: {property.id?.slice(0, 8)}</span>
                  )}
                  
                  <Link 
                    to={`/property/${property.id}`}
                    className="text-sm font-bold text-[#002366] hover:text-[#002366]/80 transition-colors"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        
        {displayedProperties.length === 0 && (
          <div className="col-span-full bg-keydeals-surface rounded-3xl border border-keydeals-border p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-keydeals-text-primary/30" />
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-xl font-bold text-keydeals-text-primary">No matching properties found</h3>
              <p className="text-keydeals-text-secondary">Don't worry! You can check our public requirement boards or post your own requirement.</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link 
                  to="/rental-leads"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#002366] text-white rounded-xl font-bold hover:bg-[#002366]/90 transition-all shadow-lg shadow-[#002366]/20"
                >
                  <Users className="w-4 h-4" />
                  Rental Leads
                </Link>
                <Link 
                  to="/property-required"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#002366] border border-[#002366] rounded-xl font-bold hover:bg-blue-50 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Property Required
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

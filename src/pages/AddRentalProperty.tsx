import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Building2, 
  Home, 
  Warehouse, 
  Trees, 
  Bed, 
  Bath, 
  ChefHat, 
  Armchair, 
  Layers, 
  Wind, 
  Droplets, 
  Zap, 
  AirVent,
  IndianRupee,
  ShieldCheck,
  Users,
  CheckSquare,
  Briefcase
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Property, PropertyType } from '../types';
import { cn } from '../lib/utils';

export function AddRentalProperty() {
  const navigate = useNavigate();
  const { addProperty, globalLocation } = useProperties();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualArea, setManualArea] = useState(false);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    type: 'Residential House',
    purpose: 'Rent',
    city: globalLocation === 'All India' ? '' : globalLocation,
    location: '',
    landmark: '',
    price: '',
    securityDeposit: '',
    occupancy: 'Independent',
    wardrobes: 0,
    furnishing: false,
    floorNumber: 0,
    frontage: undefined,
    loadingDock: false,
    ceilingHeight: '',
    dimensionsLength: undefined,
    dimensionsWidth: undefined,
    builtUpAreaSqFt: undefined,
    floorLevel: 'Ground',
    washroomAvailable: false,
    pantryAvailable: false,
    amenities: {
      fan: false,
      waterpump: false,
      submeter: false,
      ac: false
    },
    carParking: false,
    bikeParking: false,
    floors: {
      ground: { bedrooms: 1, washrooms: 1, livingRooms: 1, kitchens: 1 }
    },
    geopoint: { lat: 0, lng: 0 },
    images: [],
    status: 'Available',
    ownerName: '',
    phoneNumber: '',
    whatsappNumber: '',
    gatedSociety: false
  });

  // Auto-calculate Total Area
  React.useEffect(() => {
    if (!manualArea && formData.dimensionsLength && formData.dimensionsWidth) {
      const calculatedArea = formData.dimensionsLength * formData.dimensionsWidth;
      if (formData.builtUpAreaSqFt !== calculatedArea) {
        setFormData(prev => ({ ...prev, builtUpAreaSqFt: calculatedArea }));
      }
    }
  }, [formData.dimensionsLength, formData.dimensionsWidth, manualArea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newProperty: Property = {
      ...formData as Property,
      id: `prop-${Date.now()}`,
      addedAt: new Date().toISOString()
    };
    
    addProperty(newProperty);
    setIsSubmitting(false);
    navigate('/rentals');
  };

  const handleGPSCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          geopoint: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
        alert('Location captured successfully!');
      });
    }
  };

  const categories: { label: string; value: PropertyType; icon: any }[] = [
    { label: 'House', value: 'Residential House', icon: Home },
    { label: 'Flat/Apartment', value: 'Flat/Apartment', icon: Building2 },
    { label: 'P.G', value: 'P.G', icon: Users },
    { label: 'Shop', value: 'Shop', icon: Building2 },
    { label: 'Commercial space', value: 'Commercial space', icon: Building2 },
    { label: 'Office space', value: 'Office space', icon: Briefcase },
    { label: 'Co-working Space', value: 'Co-working Space', icon: Briefcase },
    { label: 'Warehouse', value: 'Warehouse' as any, icon: Warehouse },
    { label: 'Farm Land', value: 'Farm Land', icon: Trees },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Post for Rent</h1>
          <p className="text-slate-500">List your property for potential tenants.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Category */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Property Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: cat.value })}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                  formData.type === cat.value 
                    ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md" 
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                )}
              >
                <cat.icon className="w-6 h-6" />
                <span className="text-sm font-bold">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Specifics - Conditional */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Property Specifics</h2>
          </div>

          {['Residential House', 'Flat/Apartment'].includes(formData.type as string) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    value={formData.floors?.ground?.bedrooms} 
                    onChange={e => setFormData({
                      ...formData, 
                      floors: { ...formData.floors, ground: { ...formData.floors?.ground!, bedrooms: parseInt(e.target.value) } }
                    })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Washrooms</label>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    value={formData.floors?.ground?.washrooms} 
                    onChange={e => setFormData({
                      ...formData, 
                      floors: { ...formData.floors, ground: { ...formData.floors?.ground!, washrooms: parseInt(e.target.value) } }
                    })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Living Rooms</label>
                <div className="flex items-center gap-3">
                  <Armchair className="w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    value={formData.floors?.ground?.livingRooms} 
                    onChange={e => setFormData({
                      ...formData, 
                      floors: { ...formData.floors, ground: { ...formData.floors?.ground!, livingRooms: parseInt(e.target.value) } }
                    })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kitchens</label>
                <div className="flex items-center gap-3">
                  <ChefHat className="w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    value={formData.floors?.ground?.kitchens} 
                    onChange={e => setFormData({
                      ...formData, 
                      floors: { ...formData.floors, ground: { ...formData.floors?.ground!, kitchens: parseInt(e.target.value) } }
                    })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Wardrobe Count</label>
                <input 
                  type="number" 
                  value={formData.wardrobes} 
                  onChange={e => setFormData({ ...formData, wardrobes: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Floor Number</label>
                <input 
                  type="number" 
                  value={formData.floorNumber} 
                  onChange={e => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input 
                  type="checkbox" 
                  id="furnishing"
                  checked={formData.furnishing} 
                  onChange={e => setFormData({ ...formData, furnishing: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <label htmlFor="furnishing" className="text-sm font-bold text-slate-700">Furnished?</label>
              </div>
            </div>
          )}

          {formData.type === 'P.G' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    value={formData.floors?.ground?.bedrooms} 
                    onChange={e => setFormData({
                      ...formData, 
                      floors: { ...formData.floors, ground: { ...formData.floors?.ground!, bedrooms: parseInt(e.target.value) } }
                    })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Washrooms</label>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    value={formData.floors?.ground?.washrooms} 
                    onChange={e => setFormData({
                      ...formData, 
                      floors: { ...formData.floors, ground: { ...formData.floors?.ground!, washrooms: parseInt(e.target.value) } }
                    })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input 
                  type="checkbox" 
                  id="furnishing_pg"
                  checked={formData.furnishing} 
                  onChange={e => setFormData({ ...formData, furnishing: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <label htmlFor="furnishing_pg" className="text-sm font-bold text-slate-700">Furnished?</label>
              </div>
            </div>
          )}

          {['Shop', 'Commercial space', 'Office space', 'Co-working Space', 'Warehouse', 'Farm Land'].includes(formData.type as string) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Frontage (ft)</label>
                <input 
                  type="number" 
                  value={formData.frontage || ''} 
                  onChange={e => setFormData({ ...formData, frontage: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Length (ft)</label>
                <input 
                  type="number" 
                  value={formData.dimensionsLength || ''} 
                  onChange={e => setFormData({ ...formData, dimensionsLength: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Width (ft)</label>
                <input 
                  type="number" 
                  value={formData.dimensionsWidth || ''} 
                  onChange={e => setFormData({ ...formData, dimensionsWidth: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 30"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Total Area (sqft)</label>
                <div className="space-y-2">
                  <input 
                    type="number" 
                    value={formData.builtUpAreaSqFt || ''} 
                    onChange={e => setFormData({ ...formData, builtUpAreaSqFt: parseInt(e.target.value) || undefined })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. 1500"
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="manualArea"
                      checked={manualArea}
                      onChange={e => setManualArea(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="manualArea" className="text-xs text-slate-500">Manual override</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Located on Floor</label>
                <select 
                  value={formData.floorLevel} 
                  onChange={e => setFormData({ ...formData, floorLevel: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Basement">Basement</option>
                  <option value="Ground">Ground</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th+">4th+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ceiling Height (ft)</label>
                <input 
                  type="text" 
                  value={formData.ceilingHeight} 
                  onChange={e => setFormData({ ...formData, ceilingHeight: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 12 ft"
                />
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="washroomAvailable"
                    checked={formData.washroomAvailable} 
                    onChange={e => setFormData({ ...formData, washroomAvailable: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <label htmlFor="washroomAvailable" className="text-sm font-bold text-slate-700">Washroom?</label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="pantryAvailable"
                    checked={formData.pantryAvailable} 
                    onChange={e => setFormData({ ...formData, pantryAvailable: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <label htmlFor="pantryAvailable" className="text-sm font-bold text-slate-700">Pantry?</label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="loadingDock"
                    checked={formData.loadingDock} 
                    onChange={e => setFormData({ ...formData, loadingDock: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <label htmlFor="loadingDock" className="text-sm font-bold text-slate-700">Loading Dock?</label>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Amenities */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Amenities</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.amenities?.fan} 
                onChange={e => setFormData({ ...formData, amenities: { ...formData.amenities!, fan: e.target.checked } })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Fan</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.amenities?.waterpump} 
                onChange={e => setFormData({ ...formData, amenities: { ...formData.amenities!, waterpump: e.target.checked } })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Waterpump</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.amenities?.submeter} 
                onChange={e => setFormData({ ...formData, amenities: { ...formData.amenities!, submeter: e.target.checked } })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Submeter</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input 
                type="checkbox" 
                checked={formData.amenities?.ac} 
                onChange={e => setFormData({ ...formData, amenities: { ...formData.amenities!, ac: e.target.checked } })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <div className="flex items-center gap-2">
                <AirVent className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700">AC</span>
              </div>
            </label>
          </div>
        </section>

        {/* Financials */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Financials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Expected Monthly Rent</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  type="text" 
                  value={formData.price} 
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 15,000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Security Deposit</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.securityDeposit} 
                  onChange={e => setFormData({ ...formData, securityDeposit: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 30,000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Occupancy</label>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400" />
                <select 
                  value={formData.occupancy} 
                  onChange={e => setFormData({ ...formData, occupancy: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Independent">Independent</option>
                  <option value="Co-occupied">Co-occupied</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Geo-Capture */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Location Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
              <input 
                required
                type="text" 
                value={formData.city} 
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g. Rohtak"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Location/Area</label>
              <input 
                required
                type="text" 
                value={formData.location} 
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                placeholder="e.g. Model Town"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleGPSCapture}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              <Navigation className="w-5 h-5" /> Lock GPS Coordinates
            </button>
            {formData.geopoint?.lat !== 0 && (
              <p className="text-xs text-emerald-600 font-bold mt-2">
                Coordinates locked: {formData.geopoint?.lat.toFixed(4)}, {formData.geopoint?.lng.toFixed(4)}
              </p>
            )}
          </div>
        </section>

        {/* Owner Details */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Owner Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Owner Name</label>
              <input 
                required
                type="text" 
                value={formData.ownerName} 
                onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input 
                required
                type="tel" 
                value={formData.phoneNumber} 
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
              <input 
                required
                type="tel" 
                value={formData.whatsappNumber} 
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
        </section>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40">
          <div className="max-w-4xl mx-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Rental Property"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

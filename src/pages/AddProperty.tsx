import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Upload, X, Camera, Navigation, Info, Home, Construction, DollarSign, Settings, Image as ImageIcon, MessageSquare, User, FileText, Scale, Map as MapIcon, CalendarClock, CheckSquare } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Property, GeoPoint, PropertyType, FacingType, RoadType, FloorDetails, DocStatus, QuotedBy, PropertyStatus, Purpose } from '../types';
import { cn } from '../lib/utils';

const PROPERTY_TYPES: PropertyType[] = ['Residential Plot', 'Residential House', 'Commercial space', 'Shop', 'Office space', 'Farm House', 'Farm Land', 'Flat/Apartment', 'P.G', 'Co-working Space'];
const FACING_TYPES: FacingType[] = ['East', 'West', 'South', 'North', 'South-East', 'South-West', 'North-East', 'North-West'];
const ROAD_TYPES: RoadType[] = ['Paved', 'Kacha', 'Main Road'];
const DOC_STATUSES: DocStatus[] = ['Original', 'Photocopy', 'None'];

const DEFAULT_FLOOR: FloorDetails = { bedrooms: 0, washrooms: 0, livingRooms: 0, kitchens: 0 };

export function AddProperty() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { properties, addProperty, updateProperty, settings } = useProperties();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Property>>({
    ownerName: '',
    phoneNumber: '',
    whatsappNumber: '',
    addedAt: new Date().toISOString().slice(0, 16),
    visitTime: '',
    visitedBy: '',
    type: 'Residential House',
    purpose: 'Sale',
    location: '',
    city: '',
    landmark: '',
    geopoint: null as any,
    facing: 'East',
    cornerSideFront: '',
    cornerSideSide: '',
    openSides: undefined,
    plotAreaSqYd: undefined,
    dimensionsLength: undefined,
    dimensionsWidth: undefined,
    builtUpAreaSqFt: undefined,
    floors: {
      ground: { ...DEFAULT_FLOOR },
      first: { ...DEFAULT_FLOOR },
      second: { ...DEFAULT_FLOOR },
      third: { ...DEFAULT_FLOOR },
      fourth: { ...DEFAULT_FLOOR },
      roof: { ...DEFAULT_FLOOR },
    },
    mutationDoc: 'None',
    saleDeedDoc: 'None',
    gpaDoc: 'None',
    possessionLetterDoc: 'None',
    leaseDoc: 'None',
    leaseTenure: '',
    propertyTaxPaid: false,
    electricityBillPaid: false,
    houseTaxPaid: false,
    siteMapApproved: false,
    price: '',
    negotiable: true,
    quotedBy: 'Owner',
    pricingRemarks: '',
    clearTitle: false,
    disputed: false,
    underMortgage: false,
    mortgageBankName: '',
    jointOwnership: false,
    freehold: false,
    leasehold: false,
    surroundingResidential: false,
    surroundingCommercial: false,
    surroundingMixed: false,
    nearbyHospital: false,
    nearbyPark: false,
    nearbySchool: false,
    nearbyMarket: false,
    nearbyPublicTransport: false,
    roadType: 'Paved',
    roadWidth: undefined,
    gatedSociety: true,
    carParking: false,
    bikeParking: false,
    images: [],
    remarks: '',
    secondVisitTime: '',
    secondVisitConfirmed: false,
    status: 'Available'
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      const propertyToEdit = properties.find(p => p.id === id);
      if (propertyToEdit) {
        setFormData({
          ...propertyToEdit,
          addedAt: propertyToEdit.addedAt ? propertyToEdit.addedAt.slice(0, 16) : '',
          visitTime: propertyToEdit.visitTime ? propertyToEdit.visitTime.slice(0, 16) : '',
          secondVisitTime: propertyToEdit.secondVisitTime ? propertyToEdit.secondVisitTime.slice(0, 16) : '',
        });
      }
    }
  }, [id, isEditing, properties]);

  const updateFormData = (updates: Partial<Property>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const plotAreaSqMtr = typeof formData.plotAreaSqYd === 'number' ? (formData.plotAreaSqYd * 0.836127).toFixed(2) : '';

  const handleCaptureLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLocating(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateFormData({
          geopoint: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please check permissions.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file: File) => URL.createObjectURL(file));
      updateFormData({ images: [...(formData.images || []), ...newImages] });
    }
  };

  const removeImage = (index: number) => {
    updateFormData({ images: (formData.images || []).filter((_, i) => i !== index) });
  };

  const handleFloorChange = (floor: keyof NonNullable<Property['floors']>, field: keyof FloorDetails, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    updateFormData({
      floors: {
        ...formData.floors,
        [floor]: {
          ...(formData.floors?.[floor] || { ...DEFAULT_FLOOR }),
          [field]: numValue
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.geopoint) {
      alert('Please capture the property location.');
      return;
    }

    const propertyData: Property = {
      ...formData,
      id: isEditing && id ? id : `prop-${Date.now()}`,
      title: formData.title || `${formData.type} at ${formData.landmark || formData.location}`,
      plotAreaSqMtr: Number(plotAreaSqMtr) || undefined,
      images: formData.images && formData.images.length > 0 
        ? formData.images 
        : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'],
      addedAt: formData.addedAt ? new Date(formData.addedAt).toISOString() : undefined,
      visitTime: formData.visitTime ? new Date(formData.visitTime).toISOString() : undefined,
      secondVisitTime: formData.secondVisitTime ? new Date(formData.secondVisitTime).toISOString() : undefined,
    } as Property;

    if (isEditing) {
      await updateProperty(propertyData);
    } else {
      await addProperty(propertyData);
      
      // Send automated owner notification
      let msg = settings.propertyOwnerTemplate
        .replace('{ownerName}', formData.ownerName || '')
        .replace('{address}', `${formData.landmark ? formData.landmark + ', ' : ''}${formData.location}`)
        .replace('{propertyType}', formData.type || '')
        .replace('{price}', formData.price || '')
        .replace('{companyName}', settings.companyName)
        .replace('{Contact Person}', settings.contactPerson)
        .replace('{contactNumber}', settings.contactNumber);

      if (window.confirm('Property added successfully! Do you want to send the notification to the owner via WhatsApp?')) {
        window.open(`https://wa.me/${formData.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }
    }
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 bg-white border border-keydeals-border rounded-full hover:bg-keydeals-bg transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-keydeals-text-secondary" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-keydeals-text-primary tracking-tight">{isEditing ? 'Edit Property' : 'Add New Property'}</h1>
          <p className="text-keydeals-text-secondary mt-1 font-medium">{isEditing ? 'Update the details of the property listing.' : 'Enter the comprehensive details of the new property listing.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Owner Details (Moved to Top) */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-keydeals-text-secondary/50" /> Owner Details
          </h2>
          
          <div>
            <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Owner Name</label>
            <input required type="text" value={formData.ownerName} onChange={e => updateFormData({ ownerName: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. John Doe" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Phone Number</label>
              <input required type="tel" value={formData.phoneNumber} onChange={e => updateFormData({ phoneNumber: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">WhatsApp Number</label>
              <input required type="tel" value={formData.whatsappNumber} onChange={e => updateFormData({ whatsappNumber: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="1234567890" />
            </div>
          </div>
        </section>

        {/* 2. Visit Details */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-keydeals-text-secondary/50" /> Visit Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Date & Time Added</label>
              <input type="datetime-local" value={formData.addedAt} onChange={e => updateFormData({ addedAt: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Visit Time</label>
              <input type="datetime-local" value={formData.visitTime} onChange={e => updateFormData({ visitTime: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Visited By</label>
              <input type="text" value={formData.visitedBy} onChange={e => updateFormData({ visitedBy: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="Agent Name" />
            </div>
          </div>
        </section>

        {/* 3. Property Info */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-keydeals-text-secondary/50" /> Property Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Type</label>
              <select 
                value={formData.type} 
                onChange={e => updateFormData({ type: e.target.value as PropertyType })}
                className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all"
              >
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Purpose</label>
              <select 
                value={formData.purpose} 
                onChange={e => updateFormData({ purpose: e.target.value as Purpose })}
                className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all"
              >
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
          </div>
        </section>

        {/* 4. Address & Location */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-keydeals-text-secondary/50" /> Address & Location
          </h2>
          
          <div>
            <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Location (Address)</label>
            <input required type="text" value={formData.location} onChange={e => updateFormData({ location: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="Full property address" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">City *</label>
              <input required type="text" value={formData.city} onChange={e => updateFormData({ city: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. Rohtak" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Landmark</label>
              <input required type="text" value={formData.landmark} onChange={e => updateFormData({ landmark: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. Near Central Park" />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-bold text-keydeals-text-primary mb-2">GPS Coordinates</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button 
                type="button"
                onClick={handleCaptureLocation}
                disabled={isLocating}
                className="flex items-center gap-2 bg-keydeals-action text-white px-4 py-2.5 rounded-xl font-bold hover:bg-keydeals-action/90 transition-colors shadow-sm disabled:opacity-70"
              >
                <Navigation className={cn("w-4 h-4", isLocating && "animate-pulse")} />
                {isLocating ? 'Capturing...' : 'Capture Current Location'}
              </button>
              
              {formData.geopoint && (
                <div className="flex items-center gap-2 text-sm text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                  <MapPin className="w-4 h-4" />
                  {formData.geopoint.lat.toFixed(6)}, {formData.geopoint.lng.toFixed(6)}
                </div>
              )}
            </div>
            {locationError && <p className="text-red-600 text-sm mt-2 font-medium">{locationError}</p>}
          </div>
        </section>

        {/* 5. Plot Details */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-keydeals-text-secondary/50" /> Plot Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Facing</label>
              <select 
                value={formData.facing} 
                onChange={e => updateFormData({ facing: e.target.value as FacingType })}
                className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all"
              >
                {FACING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Number of Open Sides</label>
              <input type="number" min="0" max="4" value={formData.openSides || ''} onChange={e => updateFormData({ openSides: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. 2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Corner-side (Front Facing)</label>
              <input type="text" value={formData.cornerSideFront} onChange={e => updateFormData({ cornerSideFront: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. East" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Corner-side (Side)</label>
              <input type="text" value={formData.cornerSideSide} onChange={e => updateFormData({ cornerSideSide: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. North" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Plot Area (sq.yd)</label>
              <input type="number" min="0" value={formData.plotAreaSqYd || ''} onChange={e => updateFormData({ plotAreaSqYd: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. 200" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Plot Area (sq.mtr) <span className="text-xs text-keydeals-text-secondary/60 font-normal">(Auto-calculated)</span></label>
              <input type="text" readOnly value={plotAreaSqMtr} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white/50 text-keydeals-text-secondary/70 cursor-not-allowed" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Dimensions Length (ft)</label>
              <input type="number" min="0" value={formData.dimensionsLength || ''} onChange={e => updateFormData({ dimensionsLength: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. 60" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Dimensions Width (ft)</label>
              <input type="number" min="0" value={formData.dimensionsWidth || ''} onChange={e => updateFormData({ dimensionsWidth: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. 30" />
            </div>
          </div>
        </section>

        {/* 6. Construction Details */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-keydeals-text-primary flex items-center gap-2">
            <Construction className="w-5 h-5 text-keydeals-text-secondary/50" /> Construction Details
          </h2>
          
          <div>
            <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Total Built-up Area (sq.ft)</label>
            <input type="number" min="0" value={formData.builtUpAreaSqFt || ''} onChange={e => updateFormData({ builtUpAreaSqFt: e.target.value ? Number(e.target.value) : 0 })} className="w-full max-w-md px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action transition-all" placeholder="e.g. 1800" />
          </div>

          <div className="overflow-x-auto rounded-xl border border-keydeals-border">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-white/30 text-keydeals-text-primary uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 border-b border-keydeals-border">Floor</th>
                  <th className="px-4 py-3 border-b border-keydeals-border">Bedrooms</th>
                  <th className="px-4 py-3 border-b border-keydeals-border">Washrooms</th>
                  <th className="px-4 py-3 border-b border-keydeals-border">Living Room</th>
                  <th className="px-4 py-3 border-b border-keydeals-border">Kitchen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-keydeals-border/30">
                {/* Ground Floor */}
                <tr className="hover:bg-white/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-keydeals-text-primary">Ground Floor</td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.ground?.bedrooms || ''} onChange={e => handleFloorChange('ground', 'bedrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.ground?.washrooms || ''} onChange={e => handleFloorChange('ground', 'washrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.ground?.livingRooms || ''} onChange={e => handleFloorChange('ground', 'livingRooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.ground?.kitchens || ''} onChange={e => handleFloorChange('ground', 'kitchens', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                </tr>
                {/* First Floor */}
                <tr className="hover:bg-white/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-keydeals-text-primary">First Floor</td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.first?.bedrooms || ''} onChange={e => handleFloorChange('first', 'bedrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.first?.washrooms || ''} onChange={e => handleFloorChange('first', 'washrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.first?.livingRooms || ''} onChange={e => handleFloorChange('first', 'livingRooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.first?.kitchens || ''} onChange={e => handleFloorChange('first', 'kitchens', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                </tr>
                {/* Second Floor */}
                <tr className="hover:bg-white/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-keydeals-text-primary">Second Floor</td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.second?.bedrooms || ''} onChange={e => handleFloorChange('second', 'bedrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.second?.washrooms || ''} onChange={e => handleFloorChange('second', 'washrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.second?.livingRooms || ''} onChange={e => handleFloorChange('second', 'livingRooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.second?.kitchens || ''} onChange={e => handleFloorChange('second', 'kitchens', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                </tr>
                {/* Third Floor */}
                <tr className="hover:bg-white/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-keydeals-text-primary">Third Floor</td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.third?.bedrooms || ''} onChange={e => handleFloorChange('third', 'bedrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.third?.washrooms || ''} onChange={e => handleFloorChange('third', 'washrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.third?.livingRooms || ''} onChange={e => handleFloorChange('third', 'livingRooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.third?.kitchens || ''} onChange={e => handleFloorChange('third', 'kitchens', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                </tr>
                {/* Fourth Floor */}
                <tr className="hover:bg-white/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-keydeals-text-primary">Fourth Floor</td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.fourth?.bedrooms || ''} onChange={e => handleFloorChange('fourth', 'bedrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.fourth?.washrooms || ''} onChange={e => handleFloorChange('fourth', 'washrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.fourth?.livingRooms || ''} onChange={e => handleFloorChange('fourth', 'livingRooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.fourth?.kitchens || ''} onChange={e => handleFloorChange('fourth', 'kitchens', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                </tr>
                {/* Roof */}
                <tr className="hover:bg-white/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-keydeals-text-primary">Roof</td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.roof?.bedrooms || ''} onChange={e => handleFloorChange('roof', 'bedrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.roof?.washrooms || ''} onChange={e => handleFloorChange('roof', 'washrooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.roof?.livingRooms || ''} onChange={e => handleFloorChange('roof', 'livingRooms', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                  <td className="px-4 py-3"><input type="number" min="0" value={formData.floors?.roof?.kitchens || ''} onChange={e => handleFloorChange('roof', 'kitchens', e.target.value)} className="w-16 px-2 py-1 border border-keydeals-border rounded-lg text-center bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-keydeals-border/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-keydeals-border bg-white rounded-xl hover:bg-keydeals-bg transition-colors">
              <input type="checkbox" checked={formData.carParking} onChange={e => updateFormData({ carParking: e.target.checked })} className="w-5 h-5 text-keydeals-action rounded focus:ring-keydeals-action" />
              <div>
                <span className="block font-bold text-keydeals-text-primary text-sm">Car Parking</span>
                <span className="text-xs text-keydeals-text-secondary/70">Tick if car parking is available</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-keydeals-border bg-white rounded-xl hover:bg-keydeals-bg transition-colors">
              <input type="checkbox" checked={formData.bikeParking} onChange={e => updateFormData({ bikeParking: e.target.checked })} className="w-5 h-5 text-keydeals-action rounded focus:ring-keydeals-action" />
              <div>
                <span className="block font-bold text-keydeals-text-primary text-sm">Bike Parking</span>
                <span className="text-xs text-keydeals-text-secondary/70">Tick if bike parking is available</span>
              </div>
            </label>
          </div>
        </section>

        {/* 7. Documentation */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-keydeals-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-keydeals-text-secondary/50" /> Documentation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Document Selects */}
              {[
                { label: 'Mutation', value: formData.mutationDoc, key: 'mutationDoc' },
                { label: 'Sale Deed', value: formData.saleDeedDoc, key: 'saleDeedDoc' },
                { label: 'GPA', value: formData.gpaDoc, key: 'gpaDoc' },
                { label: 'Possession Letter', value: formData.possessionLetterDoc, key: 'possessionLetterDoc' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <label className="text-sm font-bold text-keydeals-text-primary">{doc.label}</label>
                  <select 
                    value={doc.value} 
                    onChange={e => updateFormData({ [doc.key]: e.target.value as DocStatus })}
                    className="w-40 px-3 py-1.5 rounded-lg border border-keydeals-border focus:ring-2 focus:ring-keydeals-action focus:border-transparent bg-white text-keydeals-text-secondary text-sm"
                  >
                    {DOC_STATUSES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              ))}
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-keydeals-text-primary">Lease</label>
                <div className="flex gap-2 w-40">
                  <select 
                    value={formData.leaseDoc} 
                    onChange={e => updateFormData({ leaseDoc: e.target.value as DocStatus })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-keydeals-border focus:ring-2 focus:ring-keydeals-action focus:border-transparent bg-white text-keydeals-text-secondary text-sm"
                  >
                    {DOC_STATUSES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {formData.leaseDoc !== 'None' && (
                <div className="flex items-center justify-between pl-4 border-l-2 border-keydeals-border">
                  <label className="text-sm font-bold text-keydeals-text-secondary">Lease Tenure</label>
                  <input type="text" value={formData.leaseTenure} onChange={e => updateFormData({ leaseTenure: e.target.value })} className="w-40 px-3 py-1.5 rounded-lg border border-keydeals-border bg-white text-keydeals-text-secondary text-sm" placeholder="e.g. 99 Years" />
                </div>
              )}
            </div>

            <div className="space-y-4 bg-white/50 p-4 rounded-xl border border-keydeals-border">
              <p className="text-sm font-bold text-keydeals-text-primary mb-2">Clearances & Taxes</p>
              {[
                { label: 'Property Tax Paid', value: formData.propertyTaxPaid, key: 'propertyTaxPaid' },
                { label: 'Electricity Bill Cleared', value: formData.electricityBillPaid, key: 'electricityBillPaid' },
                { label: 'House Tax Paid', value: formData.houseTaxPaid, key: 'houseTaxPaid' },
                { label: 'Site Map Approved', value: formData.siteMapApproved, key: 'siteMapApproved' },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={item.value} onChange={e => updateFormData({ [item.key]: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
                  <span className="text-sm font-medium text-keydeals-text-primary">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Pricing */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-keydeals-text-secondary/50" /> Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Total Price *</label>
              <input required type="text" value={formData.price} onChange={e => updateFormData({ price: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action focus:border-transparent" placeholder="e.g. 50 Lacs, 1.5 Crore" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-2">Price Negotiable</label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="negotiable" checked={formData.negotiable} onChange={() => updateFormData({ negotiable: true })} className="w-4 h-4 text-keydeals-action focus:ring-keydeals-action" />
                  <span className="text-keydeals-text-primary font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="negotiable" checked={!formData.negotiable} onChange={() => updateFormData({ negotiable: false })} className="w-4 h-4 text-keydeals-action focus:ring-keydeals-action" />
                  <span className="text-keydeals-text-primary font-medium">No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-2">Quoted By</label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="quotedBy" checked={formData.quotedBy === 'Owner'} onChange={() => updateFormData({ quotedBy: 'Owner' })} className="w-4 h-4 text-keydeals-action focus:ring-keydeals-action" />
                  <span className="text-keydeals-text-primary font-medium">Owner</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="quotedBy" checked={formData.quotedBy === 'Broker'} onChange={() => updateFormData({ quotedBy: 'Broker' })} className="w-4 h-4 text-keydeals-action focus:ring-keydeals-action" />
                  <span className="text-keydeals-text-primary font-medium">Broker</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Pricing Remarks</label>
            <input type="text" value={formData.pricingRemarks} onChange={e => updateFormData({ pricingRemarks: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action focus:border-transparent" placeholder="e.g. Includes all fixtures" />
          </div>
        </section>

        {/* 9. Legal Status */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-keydeals-text-secondary/50" /> Owner Legal Status
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-keydeals-border rounded-xl bg-white hover:bg-keydeals-bg transition-colors">
              <input type="checkbox" checked={formData.clearTitle} onChange={e => updateFormData({ clearTitle: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
              <span className="text-sm font-bold text-keydeals-text-primary">Clear Title</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-keydeals-border rounded-xl bg-white hover:bg-keydeals-bg transition-colors">
              <input type="checkbox" checked={formData.disputed} onChange={e => updateFormData({ disputed: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
              <span className="text-sm font-bold text-keydeals-text-primary">Disputed</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-keydeals-border rounded-xl bg-white hover:bg-keydeals-bg transition-colors">
              <input type="checkbox" checked={formData.jointOwnership} onChange={e => updateFormData({ jointOwnership: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
              <span className="text-sm font-bold text-keydeals-text-primary">Joint Ownership</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-keydeals-border rounded-xl bg-white hover:bg-keydeals-bg transition-colors">
              <input type="checkbox" checked={formData.freehold} onChange={e => updateFormData({ freehold: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
              <span className="text-sm font-bold text-keydeals-text-primary">Freehold</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-keydeals-border rounded-xl bg-white hover:bg-keydeals-bg transition-colors">
              <input type="checkbox" checked={formData.leasehold} onChange={e => updateFormData({ leasehold: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
              <span className="text-sm font-bold text-keydeals-text-primary">Lease hold</span>
            </label>
          </div>
          
          <div className="p-4 border border-keydeals-border rounded-xl bg-white/50">
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" checked={formData.underMortgage} onChange={e => updateFormData({ underMortgage: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
              <span className="text-sm font-bold text-keydeals-text-primary">Under Mortgage</span>
            </label>
            {formData.underMortgage && (
              <div className="pl-7">
                <input type="text" value={formData.mortgageBankName} onChange={e => updateFormData({ mortgageBankName: e.target.value })} className="w-full max-w-sm px-4 py-2 rounded-lg border border-keydeals-border bg-white text-keydeals-text-secondary text-sm" placeholder="Enter Bank Name" />
              </div>
            )}
          </div>
        </section>

        {/* 10. Environment (Surrounding & Nearby) */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-keydeals-text-primary flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-keydeals-text-secondary/50" /> Environment & Nearby
          </h2>
          
          <div>
            <h3 className="text-sm font-bold text-keydeals-text-primary mb-3">Surrounding Area</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Residential', value: formData.surroundingResidential, key: 'surroundingResidential' },
                { label: 'Commercial', value: formData.surroundingCommercial, key: 'surroundingCommercial' },
                { label: 'Mixed', value: formData.surroundingMixed, key: 'surroundingMixed' },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-keydeals-border hover:bg-keydeals-bg transition-colors">
                  <input type="checkbox" checked={item.value} onChange={e => updateFormData({ [item.key]: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
                  <span className="text-sm font-bold text-keydeals-text-primary">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-keydeals-text-primary mb-3">Nearby Amenities</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Hospital', value: formData.nearbyHospital, key: 'nearbyHospital' },
                { label: 'Park', value: formData.nearbyPark, key: 'nearbyPark' },
                { label: 'School', value: formData.nearbySchool, key: 'nearbySchool' },
                { label: 'Market', value: formData.nearbyMarket, key: 'nearbyMarket' },
                { label: 'Public Transport', value: formData.nearbyPublicTransport, key: 'nearbyPublicTransport' },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-keydeals-border hover:bg-keydeals-bg transition-colors">
                  <input type="checkbox" checked={item.value} onChange={e => updateFormData({ [item.key]: e.target.checked })} className="w-4 h-4 text-keydeals-action rounded focus:ring-keydeals-action" />
                  <span className="text-sm font-bold text-keydeals-text-primary">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Other Details */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-keydeals-text-secondary/50" /> Other Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Road Type</label>
              <select 
                value={formData.roadType} 
                onChange={e => updateFormData({ roadType: e.target.value as RoadType })}
                className="w-full px-4 py-2 rounded-xl border border-keydeals-border focus:ring-2 focus:ring-keydeals-action focus:border-transparent bg-white text-keydeals-text-secondary"
              >
                {ROAD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Road Width (ft)</label>
              <input type="number" min="0" value={formData.roadWidth || ''} onChange={e => updateFormData({ roadWidth: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action focus:border-transparent" placeholder="e.g. 40" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-2">Gated Society</label>
              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gated" checked={formData.gatedSociety} onChange={() => updateFormData({ gatedSociety: true })} className="w-4 h-4 text-keydeals-action focus:ring-keydeals-action" />
                  <span className="text-keydeals-text-primary font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gated" checked={!formData.gatedSociety} onChange={() => updateFormData({ gatedSociety: false })} className="w-4 h-4 text-keydeals-action focus:ring-keydeals-action" />
                  <span className="text-keydeals-text-primary font-medium">No</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* 12. Photos & Remarks */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-keydeals-text-secondary/50" /> Photos & Remarks
          </h2>
          
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-keydeals-border rounded-2xl p-8 bg-white hover:bg-keydeals-bg hover:border-keydeals-action transition-colors group"
            >
              <div className="w-12 h-12 bg-keydeals-bg text-keydeals-action rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-keydeals-text-primary">Upload Photos ({(formData.images || []).length})</p>
                <p className="text-sm text-keydeals-text-secondary mt-1 font-medium">Click to select or take pictures</p>
              </div>
            </button>
          </div>

          {(formData.images || []).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {(formData.images || []).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-keydeals-border group">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-sm rounded-full text-keydeals-text-secondary hover:text-red-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4">
            <label className="block text-sm font-bold text-keydeals-text-primary mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-keydeals-text-secondary/50" /> General Remarks
            </label>
            <textarea value={formData.remarks} onChange={e => updateFormData({ remarks: e.target.value })} rows={4} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action focus:border-transparent" placeholder="Any additional remarks or description..." />
          </div>
        </section>

        {/* 13. Follow-up / Second Visit */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-keydeals-text-secondary/50" /> Follow-up / Second Visit
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Updated Date & Time for Second Visit</label>
              <input type="datetime-local" value={formData.secondVisitTime} onChange={e => updateFormData({ secondVisitTime: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-keydeals-action focus:border-transparent" />
            </div>
            <div className="pb-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.secondVisitConfirmed} onChange={e => updateFormData({ secondVisitConfirmed: e.target.checked })} className="w-5 h-5 text-keydeals-action rounded focus:ring-keydeals-action" />
                <span className="font-bold text-keydeals-text-primary">Updating Confirmation</span>
              </label>
            </div>
          </div>
        </section>

        {/* 14. Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-keydeals-border">
          <button 
            type="submit" 
            onClick={() => updateFormData({ status: 'Available' })} 
            className="flex-1 sm:flex-none bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md text-center"
          >
            Save as Available
          </button>
          <button 
            type="submit" 
            onClick={() => updateFormData({ status: 'Sold' })} 
            className="flex-1 sm:flex-none bg-keydeals-action text-white px-8 py-3.5 rounded-xl font-bold hover:bg-keydeals-action/90 transition-colors shadow-md text-center"
          >
            Save as Sold
          </button>
          <button 
            type="submit" 
            onClick={() => updateFormData({ status: 'Plan Cancelled' })} 
            className="flex-1 sm:flex-none bg-keydeals-text-secondary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-keydeals-text-secondary/90 transition-colors shadow-md text-center"
          >
            Save as Plan Cancelled
          </button>
        </div>
      </form>
    </div>
  );
}

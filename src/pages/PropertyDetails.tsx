import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Share2, Download, ArrowLeft, Calendar, User, Navigation, Edit, Trash2, Maximize2, Layers, Bath, ChefHat, Wind, Droplets, Zap, AirVent, IndianRupee, ShieldCheck, Users, Building2, ArrowDown } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { SinglePropertyMap } from '../components/SinglePropertyMap';

export function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, deleteProperty } = useProperties();
  const property = properties.find(p => p.id === id);

  if (!property) {
    return <div className="p-8 text-center text-slate-500">Property not found.</div>;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(property.id);
      navigate('/');
    }
  };

  const generateLeadSummary = () => {
    const text = `*Property Summary*\n\n*Title:* ${property.title}\n*Purpose:* ${property.purpose}\n*Price:* ₹${property.price}\n*Location:* ${property.location}\n*Landmark:* ${property.landmark}\n*Status:* ${property.status}\n\n*Description:* ${property.description}`;
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard! Ready to share.');
  };

  const exportVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${property.ownerName}
TEL;TYPE=CELL:${property.phoneNumber}
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${property.ownerName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${property.geopoint.lat},${property.geopoint.lng}`;
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.geopoint.lat},${property.geopoint.lng}`;
  const whatsappMsg = encodeURIComponent(`Hi ${property.ownerName}, I'm contacting you regarding your property: ${property.title}.`);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{property.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to={`/edit-property/${property.id}`}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
        <div className="md:col-span-2 h-full rounded-2xl overflow-hidden shadow-sm">
          <img src={property.images[0]} alt="Main" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          {property.images.slice(1, 3).map((img, idx) => (
            <div key={idx} className="flex-1 rounded-2xl overflow-hidden shadow-sm">
              <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-slate-900">₹ {property.price}</h2>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg w-fit">
                  For {property.purpose}
                </span>
              </div>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider",
                property.status === 'Available' ? "bg-emerald-100 text-emerald-800" : 
                property.status === 'Sold' ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
              )}>
                {property.status}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{property.description}</p>
            
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Landmark</p>
                <p className="font-medium text-slate-900 mt-1">{property.landmark}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Coordinates</p>
                <p className="font-mono text-sm text-slate-900 mt-1">{property.geopoint.lat.toFixed(4)}, {property.geopoint.lng.toFixed(4)}</p>
              </div>
            </div>
          </section>

          {/* Detailed Specs */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" /> Property Specs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {property.type && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Type</p>
                    <p className="font-bold text-slate-900">{property.type}</p>
                  </div>
                </div>
              )}
              {property.builtUpAreaSqFt && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Area</p>
                    <p className="font-bold text-slate-900">{property.builtUpAreaSqFt} Sq Ft</p>
                  </div>
                </div>
              )}
              {property.dimensionsLength && property.dimensionsWidth && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Dimensions</p>
                    <p className="font-bold text-slate-900">{property.dimensionsLength} x {property.dimensionsWidth} ft</p>
                  </div>
                </div>
              )}
              {property.frontage && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <ArrowLeft className="w-4 h-4 text-slate-400 rotate-45" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Frontage</p>
                    <p className="font-bold text-slate-900">{property.frontage} ft</p>
                  </div>
                </div>
              )}
              {property.floorLevel && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Layers className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Floor Level</p>
                    <p className="font-bold text-slate-900">{property.floorLevel}</p>
                  </div>
                </div>
              )}
              {property.washroomAvailable !== undefined && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Bath className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Washroom</p>
                    <p className="font-bold text-slate-900">{property.washroomAvailable ? 'Available' : 'Not Available'}</p>
                  </div>
                </div>
              )}
              {property.pantryAvailable !== undefined && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <ChefHat className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pantry</p>
                    <p className="font-bold text-slate-900">{property.pantryAvailable ? 'Available' : 'Not Available'}</p>
                  </div>
                </div>
              )}
              {property.ceilingHeight && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <ArrowDown className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ceiling Height</p>
                    <p className="font-bold text-slate-900">{property.ceilingHeight}</p>
                  </div>
                </div>
              )}
              {property.securityDeposit && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Security Deposit</p>
                    <p className="font-bold text-slate-900">₹ {property.securityDeposit}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Construction Details */}
          {property.floors && Object.keys(property.floors).length > 0 && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Floor Details</h3>
              <div className="space-y-4">
                {Object.entries(property.floors).map(([floor, details]) => {
                  const floorDetails = details as any;
                  if (!floorDetails || (floorDetails.bedrooms === 0 && floorDetails.washrooms === 0 && floorDetails.kitchens === 0 && floorDetails.livingRooms === 0)) return null;
                  return (
                    <div key={floor} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 capitalize mb-3 border-b border-slate-200 pb-2">{floor} Floor</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Bedrooms</p>
                          <p className="font-semibold text-slate-900">{floorDetails.bedrooms || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Washrooms</p>
                          <p className="font-semibold text-slate-900">{floorDetails.washrooms || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Kitchens</p>
                          <p className="font-semibold text-slate-900">{floorDetails.kitchens || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">Living Rms</p>
                          <p className="font-semibold text-slate-900">{floorDetails.livingRooms || 0}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Legal & Documentation */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Legal & Documentation</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Clear Title</p>
                <p className="font-semibold text-slate-900">{property.clearTitle ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Disputed</p>
                <p className="font-semibold text-slate-900">{property.disputed ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Under Mortgage</p>
                <p className="font-semibold text-slate-900">{property.underMortgage ? `Yes (${property.mortgageBankName})` : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Ownership</p>
                <p className="font-semibold text-slate-900">{property.jointOwnership ? 'Joint' : 'Single'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Property Type</p>
                <p className="font-semibold text-slate-900">{property.freehold ? 'Freehold' : property.leasehold ? 'Leasehold' : 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Location</h3>
              <a 
                href={mapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                Open in Google Maps <MapPin className="w-4 h-4" />
              </a>
            </div>
            <div className="h-64 rounded-xl overflow-hidden border border-slate-200 relative">
              <SinglePropertyMap property={property} />
            </div>
          </section>
        </div>

        {/* Right Column: Owner & Actions */}
        <div className="space-y-6">
          {/* Owner Card */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" /> Owner Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Name</p>
                <p className="font-bold text-slate-900 text-lg">{property.ownerName}</p>
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={`tel:${property.phoneNumber}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a 
                  href={`https://wa.me/${property.whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              <button 
                onClick={exportVCard}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" /> Save Contact (vCard)
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            
            <a 
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm mb-4"
            >
              <Navigation className="w-5 h-5" /> Navigate to Site
            </a>

            <button 
              onClick={generateLeadSummary}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group text-left"
            >
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-blue-900">Generate Summary</p>
                <p className="text-xs text-slate-500 group-hover:text-blue-700">Copy formatted details to share</p>
              </div>
              <Share2 className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
            </button>

            {property.visitTime && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 font-medium mb-1">
                  <Calendar className="w-4 h-4" /> Scheduled Visit
                </div>
                <p className="text-sm text-slate-600">
                  {format(new Date(property.visitTime), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Lead, Property } from '../types';
import { Phone, MessageCircle, FileText, Calendar, Search, Filter, Edit, Trash2, Briefcase, Mail, ShoppingCart, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

export function Leads() {
  const { leads, deleteLead, properties, settings } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cart State
  const [cartClient, setCartClient] = useState<Lead | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone.includes(searchTerm)
  );

  const handleSendStatusUpdate = (lead: Lead) => {
    const property = properties.find(p => p.id === lead.interestedIn);
    const msg = `Hi ${lead.name}, this is an update regarding ${property?.title || 'the property'}. It is currently ${property?.status || 'available'}. Let me know if you have any questions!`;
    window.open(`https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleScheduleVisit = (lead: Lead) => {
    const property = properties.find(p => p.id === lead.interestedIn);
    const msg = `Hi ${lead.name}, would you like to schedule a visit for ${property?.title || 'the property'}? Let me know what time works best for you.`;
    window.open(`https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteLead(id);
    }
  };

  const openCart = (lead: Lead) => {
    setCartClient(lead);
    setSelectedProperties(lead.cartProperties || []);
  };

  const togglePropertyInCart = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const sendCartSummary = () => {
    if (!cartClient || selectedProperties.length === 0) return;

    const selectedProps = properties.filter(p => selectedProperties.includes(p.id));
    
    let listText = '';
    selectedProps.forEach(p => {
      listText += `- ${p.type}, ${p.landmark || p.location}, ₹${p.price}\n`;
    });

    let msg = settings.clientVisitTemplate
      .replace('[List: Property Type, Landmark, Price]', listText.trim())
      .replace('{companyName}', settings.companyName)
      .replace('{Contact Person}', settings.contactPerson)
      .replace('{contactNumber}', settings.contactNumber);

    window.open(`https://wa.me/${cartClient.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setCartClient(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-keydeals-text-primary tracking-tight">Buyer Clients</h1>
          <p className="text-keydeals-text-secondary mt-1 font-medium">Manage leads, track interest, and communicate.</p>
        </div>
        <Link to="/add-client" className="bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm text-center">
          Add Lead
        </Link>
      </div>

      <div className="bg-keydeals-surface rounded-2xl border border-keydeals-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-keydeals-border flex flex-col sm:flex-row gap-4 justify-between bg-white/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-keydeals-border rounded-xl text-keydeals-text-secondary font-bold hover:bg-keydeals-bg transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Leads List */}
        <div className="divide-y divide-keydeals-border">
          {filteredLeads.map(lead => {
            const property = properties.find(p => p.id === lead.interestedIn);
            
            return (
              <div key={lead.id} className="p-6 hover:bg-white/40 transition-colors flex flex-col lg:flex-row gap-6">
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-keydeals-text-primary">{lead.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-keydeals-text-secondary font-medium">
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-blue-700 transition-colors">
                          <Phone className="w-4 h-4" /> {lead.phone}
                        </a>
                        {lead.email && (
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4" /> {lead.email}
                          </span>
                        )}
                        {lead.profession && (
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4" /> {lead.profession}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                        lead.status === 'New' ? "bg-blue-100 text-blue-800" :
                        lead.status === 'Contacted' ? "bg-amber-100 text-amber-800" :
                        lead.status === 'Qualified' ? "bg-emerald-100 text-emerald-800" :
                        "bg-white/30 text-keydeals-text-secondary"
                      )}>
                        {lead.status}
                      </span>
                      <button 
                        onClick={() => openCart(lead)}
                        className="p-2 text-blue-700 hover:text-blue-800 hover:bg-white/40 rounded-lg transition-colors"
                        title="Visit Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <Link 
                        to={`/edit-client/${lead.id}`}
                        className="p-2 text-keydeals-text-secondary/50 hover:text-keydeals-text-primary hover:bg-white/40 rounded-lg transition-colors"
                        title="Edit Client"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/20 p-4 rounded-xl border border-keydeals-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider mb-1">Purpose</p>
                        <p className="font-bold text-keydeals-text-secondary">{lead.purpose || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider mb-1">Budget</p>
                        <p className="font-bold text-keydeals-text-secondary">
                          {lead.budgetMin || '0'} - {lead.budgetMax || 'Any'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider mb-1">Location</p>
                        <p className="font-bold text-keydeals-text-secondary">{lead.location || 'Any'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider mb-1">Facing</p>
                        <p className="font-bold text-keydeals-text-secondary">{lead.preferredFacing || 'Any'}</p>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-keydeals-text-primary uppercase tracking-wider mb-1">Interested In</p>
                    {property ? (
                      <Link to={`/property/${property.id}`} className="font-bold text-blue-700 hover:text-blue-800 transition-colors line-clamp-1">
                        {property.title} - ₹{property.price}
                      </Link>
                    ) : (
                      <span className="text-keydeals-text-secondary/60 italic">No specific property linked</span>
                    )}
                    <p className="text-sm text-keydeals-text-secondary mt-2 italic border-l-2 border-keydeals-border pl-3">"{lead.notes}"</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-64 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-keydeals-border pt-4 lg:pt-0 lg:pl-6">
                  <p className="text-xs font-bold text-keydeals-text-primary/50 uppercase tracking-wider mb-1">Follow-up Templates</p>
                  
                  <button 
                    onClick={() => handleSendStatusUpdate(lead)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-keydeals-border text-keydeals-text-secondary py-2 rounded-xl font-bold hover:bg-keydeals-bg transition-colors shadow-sm text-sm"
                  >
                    <FileText className="w-4 h-4 text-blue-700" /> Send Status Update
                  </button>
                  
                  <button 
                    onClick={() => handleScheduleVisit(lead)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-keydeals-border text-keydeals-text-secondary py-2 rounded-xl font-bold hover:bg-keydeals-bg transition-colors shadow-sm text-sm"
                  >
                    <Calendar className="w-4 h-4 text-emerald-600" /> Schedule Visit
                  </button>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <a 
                      href={`tel:${lead.phone}`}
                      className="flex items-center justify-center gap-1.5 bg-blue-700 text-white py-2 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm text-sm"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a 
                      href={`https://wa.me/${lead.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm text-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> Chat
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredLeads.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No leads found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Visit Cart Modal */}
      {cartClient && (
        <div className="fixed inset-0 bg-keydeals-text-primary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-keydeals-surface rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-keydeals-border">
            <div className="p-6 border-b border-keydeals-border flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-keydeals-text-primary tracking-tight">Visit Cart</h2>
                <p className="text-keydeals-text-secondary text-sm mt-1 font-medium">Select properties visited by {cartClient.name}</p>
              </div>
              <button 
                onClick={() => setCartClient(null)}
                className="p-2 text-keydeals-text-secondary/50 hover:text-keydeals-text-primary hover:bg-white/40 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {properties.map(property => {
                const isSelected = selectedProperties.includes(property.id);
                return (
                  <div 
                    key={property.id}
                    onClick={() => togglePropertyInCart(property.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                      isSelected 
                        ? "border-blue-700 bg-blue-50 shadow-sm" 
                        : "border-keydeals-border bg-white/30 hover:border-blue-300 hover:bg-white/50"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
                      isSelected ? "bg-blue-700 border-blue-700" : "border-keydeals-border bg-white"
                    )}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-keydeals-text-primary truncate">{property.title}</h4>
                      <p className="text-sm text-keydeals-text-secondary truncate font-medium">{property.location} • ₹{property.price}</p>
                    </div>
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={property.images[0] || 'https://picsum.photos/seed/' + property.id + '/800/600'} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-keydeals-border bg-white/20 rounded-b-2xl flex justify-between items-center">
              <span className="text-keydeals-text-primary font-bold">
                {selectedProperties.length} properties selected
              </span>
              <button
                onClick={sendCartSummary}
                disabled={selectedProperties.length === 0}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-5 h-5" /> Send Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, User, Phone, MessageCircle, Briefcase, MapPin, Target, Mail, DollarSign, Compass, Filter, FileText, Trash2 } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Lead, FacingType, PurchasePurpose, LeadSource } from '../types';

const FACING_TYPES: FacingType[] = ['East', 'West', 'South', 'North', 'South-East', 'South-West', 'North-East', 'North-West'];

export function AddClient() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { leads, addLead, updateLead, deleteLead } = useProperties();
  
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [profession, setProfession] = useState('');
  const [residentAddress, setResidentAddress] = useState('');
  const [purpose, setPurpose] = useState<PurchasePurpose>('Purchase');
  const [email, setEmail] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [location, setLocation] = useState('');
  const [preferredFacing, setPreferredFacing] = useState<FacingType>('East');
  const [source, setSource] = useState<LeadSource>('Direct');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      const clientToEdit = leads.find(l => l.id === id);
      if (clientToEdit) {
        setName(clientToEdit.name || '');
        setPhone(clientToEdit.phone || '');
        setWhatsapp(clientToEdit.whatsapp || '');
        setProfession(clientToEdit.profession || '');
        setResidentAddress(clientToEdit.residentAddress || '');
        setPurpose(clientToEdit.purpose || 'Purchase');
        setEmail(clientToEdit.email || '');
        setBudgetMin(clientToEdit.budgetMin || '');
        setBudgetMax(clientToEdit.budgetMax || '');
        setLocation(clientToEdit.location || '');
        setPreferredFacing(clientToEdit.preferredFacing || 'East');
        setSource(clientToEdit.source || 'Direct');
        setNotes(clientToEdit.notes || '');
      }
    }
  }, [id, isEditing, leads]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Lead = {
      id: isEditing && id ? id : `lead-${Date.now()}`,
      name,
      phone,
      whatsapp,
      interestedIn: '', // Default or handle appropriately
      status: 'New', // Default status
      profession,
      residentAddress,
      purpose,
      email,
      budgetMin,
      budgetMax,
      location,
      preferredFacing,
      source,
      notes,
    };

    if (isEditing) {
      updateLead(newClient);
    } else {
      addLead(newClient);
    }
    navigate('/leads');
  };

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this client?')) {
      deleteLead(id);
      navigate('/leads');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/leads" className="p-2 bg-white border border-keydeals-border rounded-full hover:bg-keydeals-bg transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-keydeals-text-secondary" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-keydeals-text-primary tracking-tight">{isEditing ? 'Edit Client' : 'Add New Client'}</h1>
            <p className="text-keydeals-text-secondary mt-1 font-medium">{isEditing ? 'Update the details of the client.' : 'Enter the comprehensive details of the new client.'}</p>
          </div>
        </div>
        {isEditing && (
          <button 
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Delete Client
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Details */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-keydeals-text-secondary/50" /> Basic Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Name *</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Phone Number *</label>
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">WhatsApp Number</label>
              <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="1234567890" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Profession</label>
              <input type="text" value={profession} onChange={e => setProfession(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Resident Address</label>
              <input type="text" value={residentAddress} onChange={e => setResidentAddress(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Current address" />
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-700" /> Requirements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Purpose</label>
              <select 
                value={purpose} 
                onChange={e => setPurpose(e.target.value as PurchasePurpose)}
                className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="Purchase">Purchase</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Preferred Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. Downtown" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Budget Min</label>
              <input type="text" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. 50 Lacs" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Budget Max</label>
              <input type="text" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. 1.5 Crore" />
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Preferred Facing</label>
              <select 
                value={preferredFacing} 
                onChange={e => setPreferredFacing(e.target.value as FacingType)}
                className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {FACING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-keydeals-text-primary mb-1">Source</label>
              <select 
                value={source} 
                onChange={e => setSource(e.target.value as LeadSource)}
                className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="Direct">Direct</option>
                <option value="Broker">Broker</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="bg-keydeals-surface p-6 rounded-2xl border border-keydeals-border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-keydeals-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-keydeals-text-secondary/50" /> Notes / Remarks
          </h2>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full px-4 py-2 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Any additional remarks..." />
        </section>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-keydeals-border">
          <button 
            type="submit" 
            className="bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md text-center"
          >
            {isEditing ? 'Update Client' : 'Save Client'}
          </button>
        </div>
      </form>
    </div>
  );
}

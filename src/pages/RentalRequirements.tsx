import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  UserCheck, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export function RentalRequirements() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    intent: 'Yes',
    city: '',
    maxBudget: '',
    moveInDate: '',
    directOwnerOnly: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Requirement Saved!</h1>
          <p className="text-slate-500 text-lg">We've noted your rental requirements. Our team will notify you as soon as a matching property is listed.</p>
        </div>
        <button 
          onClick={() => navigate('/rentals')}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
          Back to Rental Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Search for Rent</h1>
          <p className="text-slate-500">Tell us what you're looking for.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          {/* Intent Capture */}
          <div className="space-y-4">
            <label className="block text-lg font-bold text-slate-900">Are you looking to Rent?</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, intent: option })}
                  className={cn(
                    "flex-1 py-4 rounded-2xl border-2 font-bold transition-all",
                    formData.intent === option 
                      ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md" 
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="text" 
                  value={formData.city} 
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="Search city..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Max Monthly Budget</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="text" 
                  value={formData.maxBudget} 
                  onChange={e => setFormData({ ...formData, maxBudget: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. 20,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Move-in Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="date" 
                  value={formData.moveInDate} 
                  onChange={e => setFormData({ ...formData, moveInDate: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>

            {/* Broker Involvement */}
            <div className="pt-4">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Direct Owner Properties Only</p>
                    <p className="text-xs text-slate-500">Hide properties listed by brokers</p>
                  </div>
                </div>
                <div 
                  onClick={() => setFormData({ ...formData, directOwnerOnly: !formData.directOwnerOnly })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    formData.directOwnerOnly ? "bg-blue-600" : "bg-slate-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                    formData.directOwnerOnly ? "translate-x-7" : "translate-x-1"
                  )} />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40">
          <div className="max-w-2xl mx-auto">
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
                  Saving Requirements...
                </>
              ) : (
                "Save Requirements"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

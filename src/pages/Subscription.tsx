import React from 'react';
import { Check, Star, Shield, Zap } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useNavigate } from 'react-router-dom';

export function Subscription() {
  const { user, setUser, subscribeToMarketplace, adminSettings } = useProperties();
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    // Mock subscription logic
    if (user) {
      if (plan === 'Marketplace') {
        subscribeToMarketplace();
      } else {
        setUser({ ...user, isSubscribed: true });
      }
      alert(`Successfully subscribed to the ${plan} plan!`);
      navigate('/');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Key Deals Plans</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Choose the right plan to grow your real estate business.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Broker Plan */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
            For Brokers
          </div>
          <div className="mb-8 relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" /> Marketplace Access
            </h3>
            <p className="text-slate-400">Unlock all Client Leads (Rental & Purchase)</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-white">₹{adminSettings.marketplaceSubscriptionAmount}</span>
              <span className="text-slate-400">/15 days</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-start gap-3 text-slate-200">
              <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <span>Unlock all Rental Leads contact numbers</span>
            </li>
            <li className="flex items-start gap-3 text-slate-200">
              <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <span>Unlock all Property Required leads</span>
            </li>
            <li className="flex items-start gap-3 text-slate-200">
              <Check className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <span>Unlimited CRM properties & leads</span>
            </li>
            <li className="flex items-start gap-3 text-white font-medium">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Contact Property Owners (₹{adminSettings.leadUnlockFee}/lead)</span>
            </li>
          </ul>

          <button 
            onClick={() => handleSubscribe('Marketplace')}
            className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 relative z-10"
          >
            Subscribe to Unlock
          </button>
          
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Owner Plan */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Property Owner</h3>
            <p className="text-slate-500">List your property for Sale or Rent</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-slate-900">₹{adminSettings.rentalPostingFee}</span>
              <span className="text-slate-500">/listing</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Publish property to public Marketplace</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Instant AI Match with potential clients</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>View matching Client contact details for FREE</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Direct inquiries from verified Brokers</span>
            </li>
          </ul>

          <button 
            onClick={() => handleSubscribe('Owner Listing')}
            className="w-full py-4 rounded-xl font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Client Note */}
      <div className="max-w-2xl mx-auto p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
        <h4 className="font-bold text-blue-900 mb-2">Are you a Client?</h4>
        <p className="text-blue-700">Posting your requirements is always <strong>FREE</strong>. We'll match you with direct owners and verified professionals automatically.</p>
      </div>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

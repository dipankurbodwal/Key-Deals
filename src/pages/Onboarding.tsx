import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  User as UserIcon, 
  Users, 
  Construction, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Briefcase,
  MapPin,
  FileText,
  ShieldCheck,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { UserRole, User } from '../types';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

type OnboardingStep = 'role-selection' | 'form' | 'success';

export function Onboarding() {
  const navigate = useNavigate();
  const { user, setUser, setMode } = useProperties();
  const [step, setStep] = useState<OnboardingStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companyName: '',
    contactPerson: '',
    contactNumber: '',
    purpose: 'Purchase' as 'Purchase' | 'On Rent' | 'Sell' | 'Rent out',
    directOwnersOnly: false,
    developerName: '',
    projectLocation: '',
    projectDetails: '',
    reraApproved: false
  });

  const [showAiMatchAlert, setShowAiMatchAlert] = useState(false);

  useEffect(() => {
    if (user?.role && user.role !== 'Guest' && user.onboardingCompleted) {
      // If user already completed onboarding, redirect to home
      navigate('/');
    }
  }, [user, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
    // Pre-fill if user exists
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        companyName: user.businessProfile?.companyName || '',
        contactPerson: user.businessProfile?.contactPerson || '',
        contactNumber: user.businessProfile?.contactNumber || ''
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!selectedRole) return;

      const updatedUser: User = {
        ...(user || { id: 'u-' + Date.now(), name: '', email: '', phone: '', isAdmin: false, isSubscribed: false, referralCount: 0, referralEarnedCount: 0 }),
        role: selectedRole,
        name: (selectedRole === 'Broker' || selectedRole === 'Developer') ? formData.contactPerson : (formData.name || user?.name || ''),
        phone: formData.phone || formData.contactNumber || user?.phone || '',
        onboardingCompleted: true,
        businessProfile: (selectedRole === 'Broker' || selectedRole === 'Developer') ? {
          companyName: selectedRole === 'Broker' ? formData.companyName : formData.developerName,
          contactPerson: formData.contactPerson,
          contactNumber: formData.contactNumber,
          developerName: selectedRole === 'Developer' ? formData.developerName : undefined,
          projectLocation: selectedRole === 'Developer' ? formData.projectLocation : undefined,
          projectDetails: selectedRole === 'Developer' ? formData.projectDetails : undefined,
          reraApproved: selectedRole === 'Developer' ? formData.reraApproved : undefined,
        } : undefined,
        clientRequirements: selectedRole === 'Client' ? {
          purpose: formData.purpose as 'Purchase' | 'On Rent',
          budgetMin: 0,
          budgetMax: 0,
          landmarks: '',
          propertyType: 'Flat/Apartment',
          directOwnersOnly: formData.directOwnersOnly
        } : undefined
      };

      // Update Supabase if user is logged in
      if (supabase && user?.id) {
        const { error: supabaseError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: updatedUser.name,
            phone_number: updatedUser.phone,
            role: selectedRole,
            company_name: updatedUser.businessProfile?.companyName,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          });

        if (supabaseError) throw supabaseError;
      }

      setUser(updatedUser);
      
      // Set mode based on role
      if (selectedRole === 'Broker' || selectedRole === 'Developer' || selectedRole === 'Property Owner') {
        setMode('Professionals');
      } else {
        setMode('Marketplace');
      }

      // Redirect to Properties page (root)
      navigate('/');

    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    if (!selectedRole) return;

    if (selectedRole === 'Broker' || selectedRole === 'Developer' || selectedRole === 'Property Owner') {
      setMode('Professionals');
    } else {
      setMode('Marketplace');
    }

    if (selectedRole === 'Broker') {
      navigate('/'); // Dashboard is the inventory page for brokers
    } else if (selectedRole === 'Property Owner') {
      if (formData.purpose === 'Sell') {
        navigate('/add-property?purpose=Sale');
      } else {
        navigate('/rentals/add');
      }
    } else if (selectedRole === 'Developer') {
      navigate('/ads'); // Builder ads page
    } else {
      navigate('/'); // Marketplace (Dashboard in Marketplace mode)
    }
  };

  const roles = [
    { 
      id: 'Broker' as UserRole, 
      title: 'Broker', 
      icon: Briefcase, 
      desc: 'Manage your property inventory and leads.',
      color: 'bg-blue-600'
    },
    { 
      id: 'Property Owner' as UserRole, 
      title: 'Property Owner', 
      icon: UserIcon, 
      desc: 'List your property for sale or rent.',
      color: 'bg-emerald-600'
    },
    { 
      id: 'Client' as UserRole, 
      title: 'Client (Buyer/Tenant)', 
      icon: Users, 
      desc: 'Find your dream home or office space.',
      color: 'bg-amber-600'
    },
    { 
      id: 'Developer' as UserRole, 
      title: 'Developer', 
      icon: Construction, 
      desc: 'Showcase your projects and builder ads.',
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#A1BCDF]/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'role-selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">How would you like to use Key Deals?</h1>
                <p className="text-slate-600 font-medium">Select a path to get started with a personalized experience.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group relative bg-white p-6 rounded-3xl border-2 border-transparent hover:border-[#1E3A8A] transition-all duration-300 shadow-sm hover:shadow-xl text-left overflow-hidden"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg", role.color)}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1E3A8A] mb-1">{role.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{role.desc}</p>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-[#A1BCDF]/30"
            >
              <button 
                onClick={() => setStep('role-selection')}
                className="mb-8 text-sm font-bold text-[#1E3A8A] flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
              >
                ← Back to selection
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-[#1E3A8A] mb-2">Complete your profile</h2>
                <p className="text-slate-600 font-medium">We need a few more details to set up your {selectedRole} account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {selectedRole === 'Broker' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="Enter your agency name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Contact Person Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            required
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="Full Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Contact Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            required
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === 'Property Owner' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="Your contact number"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Do you want to Sell or Rent out?</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Sell', 'Rent out'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, purpose: opt as any }))}
                            className={cn(
                              "py-4 rounded-2xl border-2 font-bold transition-all",
                              formData.purpose === opt 
                                ? "bg-[#1E3A8A] text-white border-[#1E3A8A]" 
                                : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === 'Client' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="Your contact number"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">I want to...</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Purchase', 'On Rent'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, purpose: opt as any }))}
                            className={cn(
                              "py-4 rounded-2xl border-2 font-bold transition-all",
                              formData.purpose === opt 
                                ? "bg-[#1E3A8A] text-white border-[#1E3A8A]" 
                                : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          name="directOwnersOnly"
                          checked={formData.directOwnersOnly}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-[#1E3A8A] rounded-lg focus:ring-[#1E3A8A]"
                        />
                        <div className="flex-1">
                          <span className="block font-bold text-[#1E3A8A] text-sm">Direct Owners Only?</span>
                          <span className="text-xs text-slate-500">Enable to get notified when a direct owner match is found.</span>
                        </div>
                        <Zap className={cn("w-5 h-5 transition-colors", formData.directOwnersOnly ? "text-amber-500" : "text-slate-300")} />
                      </label>
                    </div>
                  </>
                )}

                {selectedRole === 'Developer' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Developer/Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="developerName"
                          value={formData.developerName}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="e.g. DLF, Godrej Properties"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Contact Person</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            required
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="Full Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Contact Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            required
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Project Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="projectLocation"
                          value={formData.projectLocation}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="City or Area"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Project Details</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                        <textarea
                          required
                          name="projectDetails"
                          value={formData.projectDetails}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50 resize-none"
                          placeholder="Briefly describe your project..."
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          name="reraApproved"
                          checked={formData.reraApproved}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-[#1E3A8A] rounded-lg focus:ring-[#1E3A8A]"
                        />
                        <div className="flex-1">
                          <span className="block font-bold text-[#1E3A8A] text-sm">RERA Approved?</span>
                          <span className="text-xs text-slate-500">Confirm if your project is RERA registered.</span>
                        </div>
                        <ShieldCheck className={cn("w-5 h-5 transition-colors", formData.reraApproved ? "text-emerald-500" : "text-slate-300")} />
                      </label>
                    </div>
                  </>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1E3A8A] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 hover:bg-[#1E3A8A]/90 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-[#A1BCDF]/30 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-[#1E3A8A]">Welcome to Key Deals!</h2>
                <p className="text-slate-600 font-medium text-lg">Your {selectedRole} account is ready to go.</p>
              </div>

              {selectedRole === 'Client' && formData.directOwnersOnly && (
                <div className={cn(
                  "p-6 rounded-3xl border transition-all duration-500",
                  showAiMatchAlert 
                    ? "bg-emerald-50 border-emerald-100 scale-105 shadow-lg shadow-emerald-100" 
                    : "bg-amber-50 border-amber-100"
                )}>
                  <div className="flex items-start gap-4 text-left">
                    <div className={cn(
                      "p-2 rounded-xl transition-colors",
                      showAiMatchAlert ? "bg-emerald-100" : "bg-amber-100"
                    )}>
                      {showAiMatchAlert ? (
                        <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
                      ) : (
                        <MessageSquare className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-bold transition-colors",
                        showAiMatchAlert ? "text-emerald-900" : "text-amber-900"
                      )}>
                        {showAiMatchAlert ? "Match Found & Notified!" : "AI Match Enabled"}
                      </h4>
                      <p className={cn(
                        "text-sm leading-relaxed transition-colors",
                        showAiMatchAlert ? "text-emerald-700" : "text-amber-700"
                      )}>
                        {showAiMatchAlert 
                          ? `We've found a direct owner match and sent them your contact details (${formData.name}, ${formData.phone}).`
                          : "We'll automatically message property owners when we find a direct match for your requirements."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleFinish}
                className="w-full bg-[#1E3A8A] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 hover:bg-[#1E3A8A]/90 transition-all"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

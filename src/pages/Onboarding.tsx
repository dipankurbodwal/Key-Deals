import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  Zap,
  Globe
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
    reraApproved: false,
    termsAccepted: false,
    // New fields
    operatingCity: '',
    reraNumber: '',
    website: '',
    city: '',
    address: '',
    propertyType: 'Flat/Apartment',
    budgetMin: '',
    budgetMax: '',
    landmarks: '',
    yearsOfExperience: '',
    specialization: 'Residential',
    operatingCities: '',
    timeline: 'Immediate',
    projectLat: null as number | null,
    projectLng: null as number | null
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
        contactNumber: user.businessProfile?.contactNumber || '',
        yearsOfExperience: user.businessProfile?.yearsOfExperience?.toString() || '',
        specialization: user.businessProfile?.specialization || 'Residential',
        operatingCities: user.businessProfile?.operatingCities || '',
        operatingCity: user.city || '',
        city: user.city || '',
        address: user.address || '',
        timeline: user.clientRequirements?.timeline || 'Immediate',
        projectLat: user.businessProfile?.projectGeoLocation?.lat || null,
        projectLng: user.businessProfile?.projectGeoLocation?.lng || null
      }));
    }
  };

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            projectLat: position.coords.latitude,
            projectLng: position.coords.longitude
          }));
        },
        (error) => {
          console.error("Error capturing location:", error);
          alert("Could not capture location. Please ensure location permissions are granted.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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
          reraNumber: selectedRole === 'Broker' ? formData.reraNumber : undefined,
          website: selectedRole === 'Developer' ? formData.website : undefined,
          operatingCity: selectedRole === 'Broker' ? formData.operatingCity : undefined,
          yearsOfExperience: selectedRole === 'Broker' ? Number(formData.yearsOfExperience) || 0 : undefined,
          specialization: selectedRole === 'Broker' ? formData.specialization as any : undefined,
          operatingCities: selectedRole === 'Developer' ? formData.operatingCities : undefined,
          projectGeoLocation: selectedRole === 'Developer' && formData.projectLat && formData.projectLng ? {
            lat: formData.projectLat,
            lng: formData.projectLng
          } : undefined,
        } : undefined,
        clientRequirements: selectedRole === 'Client' ? {
          purpose: formData.purpose as 'Purchase' | 'On Rent',
          budgetMin: Number(formData.budgetMin) || 0,
          budgetMax: Number(formData.budgetMax) || 0,
          landmarks: formData.landmarks,
          propertyType: formData.propertyType,
          directOwnersOnly: formData.directOwnersOnly,
          timeline: formData.timeline as any
        } : undefined,
        ownerProfile: selectedRole === 'Property Owner' ? {
          propertyType: formData.propertyType,
          purpose: formData.purpose as 'Sell' | 'Rent out'
        } : undefined,
        city: selectedRole === 'Property Owner' ? formData.city : (selectedRole === 'Broker' ? formData.operatingCity : undefined),
        address: selectedRole === 'Broker' ? formData.address : undefined
      };

      // Update Supabase if user is logged in
      if (supabase && user?.id) {
        const userEmail = user.email || (await supabase.auth.getUser()).data.user?.email || formData.email || '';
        
        // Update auth user metadata to ensure all custom fields are saved
        const { error: authError } = await supabase.auth.updateUser({
          data: {
            role: selectedRole,
            businessProfile: updatedUser.businessProfile,
            clientRequirements: updatedUser.clientRequirements,
            ownerProfile: updatedUser.ownerProfile,
            city: updatedUser.city,
            address: updatedUser.address,
            onboardingCompleted: true
          }
        });

        if (authError) console.error('Error updating auth metadata:', authError);

        const { error: supabaseError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: updatedUser.name,
            phone_number: updatedUser.phone,
            company_name: updatedUser.businessProfile?.companyName || '',
            role: selectedRole,
            onboarding_completed: true,
            created_at: user.createdAt || new Date().toISOString(),
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
                <p className="text-slate-600 font-medium">
                  {selectedRole === 'Broker' && "Set up your broker profile to start managing inventory and connecting with clients."}
                  {selectedRole === 'Property Owner' && "Tell us a bit about yourself so we can help you list your property effectively."}
                  {selectedRole === 'Client' && "Help us understand your requirements so we can find the perfect match for you."}
                  {selectedRole === 'Developer' && "Create your developer profile to showcase your projects to our network."}
                </p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Operating City</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            required
                            name="operatingCity"
                            value={formData.operatingCity}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="e.g. Mumbai, Delhi"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">RERA Number (Optional)</label>
                        <div className="relative">
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            name="reraNumber"
                            value={formData.reraNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="Registration No."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Office Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          required
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="Complete office address"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Years of Experience</label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="e.g. 5"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Specialization</label>
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Both">Both</option>
                        </select>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">City</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            required
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="City"
                          />
                        </div>
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
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Property Type</label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                      >
                        <option value="Flat/Apartment">Flat/Apartment</option>
                        <option value="House/Villa">House/Villa</option>
                        <option value="Plot/Land">Plot/Land</option>
                        <option value="Commercial Space">Commercial Space</option>
                        <option value="P.G">P.G</option>
                        <option value="Co-working Space">Co-working Space</option>
                      </select>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Property Type</label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                        >
                          <option value="Flat/Apartment">Flat/Apartment</option>
                          <option value="House/Villa">House/Villa</option>
                          <option value="Plot/Land">Plot/Land</option>
                          <option value="Commercial Space">Commercial Space</option>
                          <option value="P.G">P.G</option>
                          <option value="Co-working Space">Co-working Space</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Preferred Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            name="landmarks"
                            value={formData.landmarks}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                            placeholder="e.g. Downtown, Sector 14"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Min Budget (₹)</label>
                        <input
                          type="number"
                          name="budgetMin"
                          value={formData.budgetMin}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1E3A8A] ml-1">Max Budget (₹)</label>
                        <input
                          type="number"
                          name="budgetMax"
                          value={formData.budgetMax}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="Any"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">When do you plan to move/buy?</label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                      >
                        <option value="Immediate">Immediate</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
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
                      <div className="mt-2 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-[#1E3A8A]">Geo Capturing for Client Site Navigation</span>
                          <button
                            type="button"
                            onClick={handleCaptureLocation}
                            className="px-4 py-2 bg-blue-100 text-[#1E3A8A] text-sm font-bold rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            Capture Location
                          </button>
                        </div>
                        {formData.projectLat && formData.projectLng ? (
                          <div className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Location captured: {formData.projectLat.toFixed(6)}, {formData.projectLng.toFixed(6)}
                          </div>
                        ) : (
                          <div className="text-sm text-slate-500">
                            Capture location to enable precise site navigation for clients.
                          </div>
                        )}
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
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Website (Optional)</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="https://www.example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#1E3A8A] ml-1">Operating Cities</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          name="operatingCities"
                          value={formData.operatingCities}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#1E3A8A] focus:ring-0 transition-all bg-slate-50/50"
                          placeholder="e.g. Mumbai, Pune, Bangalore"
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

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center h-5">
                      <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        required
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#1E3A8A] rounded-lg focus:ring-[#1E3A8A] cursor-pointer"
                      />
                    </div>
                    <div className="text-sm">
                      <label htmlFor="termsAccepted" className="font-bold text-[#1E3A8A] cursor-pointer">
                        I agree to the <Link to="/terms" target="_blank" className="underline decoration-blue-300 hover:decoration-blue-700 transition-colors">Terms & Conditions</Link>
                      </label>
                      <p className="text-slate-500 text-xs mt-1">
                        By checking this box, you acknowledge that you have read and agree to our professional terms of service.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !formData.termsAccepted}
                    className="w-full bg-[#1E3A8A] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 hover:bg-[#1E3A8A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                </div>
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

import React, { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Link } from 'react-router-dom';
import { Save, Building2, User, Phone, Mail, FileText, Settings as SettingsIcon, Globe, Moon, Sun, Fingerprint, Store, Share2, MessageCircle, Calculator, ArrowRight, CheckCircle2, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

const LANGUAGES = [
  { code: 'en', name: 'English', script: 'English' },
  { code: 'hi', name: 'Hindi', script: 'हिंदी' },
  { code: 'mr', name: 'Marathi', script: 'मराठी' },
  { code: 'te', name: 'Telugu', script: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', script: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', script: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', script: 'ગુજરાતી' }
];

export function Settings() {
  const { 
    settings, updateSettings, darkMode, setDarkMode, 
    biometricsEnabled, setBiometricsEnabled, user 
  } = useProperties();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('company_name, full_name, phone_number')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          const updatedSettings = {
            ...settings,
            companyName: data.company_name || '',
            contactPerson: data.full_name || '',
            contactNumber: data.phone_number || ''
          };
          setFormData(updatedSettings);
          updateSettings(updatedSettings);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // The onAuthStateChange listener in PropertyContext will handle state cleanup
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setError(null);
    
    try {
      const { error: supabaseError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          company_name: formData.companyName,
          full_name: formData.contactPerson,
          phone_number: formData.contactNumber,
          updated_at: new Date().toISOString()
        });

      if (supabaseError) throw supabaseError;

      updateSettings(formData);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            Profile Updated Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-keydeals-text-primary tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-blue-700" /> {t('nav.settings')}
          </h1>
          <p className="text-keydeals-text-secondary mt-1">Manage your preferences, company profile and message templates.</p>
        </div>
        {user?.isAdmin && (
          <Link 
            to="/admin" 
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Store className="w-5 h-5 text-keydeals-surface" />
            Success Dashboard
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* App Preferences & Refer & Earn */}
        <div className="lg:col-span-1 space-y-6">
          {/* App Preferences */}
          <div className="bg-keydeals-surface rounded-2xl border border-keydeals-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-keydeals-border bg-white/10">
              <h2 className="text-lg font-bold text-keydeals-text-primary">App Preferences</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Language */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-keydeals-text-primary flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-700" /> {t('settings.language')}
                </label>
                <div className="relative">
                  <select
                    value={i18n.language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.script})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-keydeals-border rotate-90" />
                  </div>
                </div>
              </div>

              {/* Tools */}
              <Link
                to="/tools"
                className="flex items-center justify-between p-3 bg-white/20 rounded-xl border border-keydeals-border group hover:bg-white/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-bold text-keydeals-text-primary">Land Area Calculator</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Terms & Conditions */}
              <Link
                to="/terms"
                className="flex items-center justify-between p-3 bg-white/20 rounded-xl border border-keydeals-border group hover:bg-white/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-bold text-keydeals-text-primary">Terms & Conditions</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Biometrics */}
              <div className="flex items-center justify-between p-3 bg-white/20 rounded-xl border border-keydeals-border">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-emerald-700" />
                  <span className="text-sm font-semibold text-keydeals-text-primary">{t('settings.biometrics')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    biometricsEnabled ? "bg-emerald-600" : "bg-slate-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    biometricsEnabled ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </div>

          {/* Refer & Earn */}
          <div className="bg-keydeals-surface rounded-2xl border border-keydeals-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-keydeals-border bg-emerald-100/50">
              <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Refer & Earn
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-white/20 rounded-xl border border-keydeals-border text-center">
                <p className="text-xs font-bold text-keydeals-text-primary uppercase tracking-wider mb-2">Your Referral Link</p>
                <code className="text-sm text-blue-800 break-all font-bold">
                  {window.location.origin}/signup?ref={user?.id}
                </code>
              </div>
              
              <button
                onClick={() => {
                  const text = `Hey! I'm using Key Deals to manage my real estate business. It has GPS navigation and AI matching. Use my link to get a 7-day free trial: ${window.location.origin}/signup?ref=${user?.id}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Share on WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-white/20 rounded-xl border border-keydeals-border">
                  <p className="text-2xl font-bold text-keydeals-text-primary">{user?.referralCount || 0}</p>
                  <p className="text-[10px] font-bold text-keydeals-text-secondary uppercase">Referrals</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-bold uppercase rounded">Pending</span>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-xl border border-keydeals-border">
                  <p className="text-2xl font-bold text-emerald-700">{user?.referralEarnedCount || 0}</p>
                  <p className="text-[10px] font-bold text-keydeals-text-secondary uppercase">Earned</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold uppercase rounded">Success</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Settings & Feedback */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Profile */}
            <div className="bg-keydeals-surface rounded-2xl border border-keydeals-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-keydeals-border bg-white/10">
                <h2 className="text-xl font-bold text-keydeals-text-primary">{t('settings.companyProfile')}</h2>
                <p className="text-sm text-keydeals-text-secondary mt-1">These details will be used in your templates and communications.</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-keydeals-text-primary flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-700" /> Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium",
                        isLoading && "animate-pulse bg-slate-50"
                      )}
                      placeholder={isLoading ? "Loading..." : "Enter company name"}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-keydeals-text-primary flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-700" /> Contact Person
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium",
                        isLoading && "animate-pulse bg-slate-50"
                      )}
                      placeholder={isLoading ? "Loading..." : "Enter contact person name"}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-keydeals-text-primary flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-700" /> Contact Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium",
                        isLoading && "animate-pulse bg-slate-50"
                      )}
                      placeholder={isLoading ? "Loading..." : "Enter contact number"}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-keydeals-text-primary flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-700" /> Customer Care Email
                    </label>
                    <input
                      type="email"
                      disabled
                      readOnly
                      value="7keydeals@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-keydeals-border bg-slate-100 text-keydeals-text-secondary/60 cursor-not-allowed"
                      title="Contact support to change this email"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Message Templates */}
            <div className="bg-keydeals-surface rounded-2xl border border-keydeals-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-keydeals-border bg-white/10">
                <h2 className="text-xl font-bold text-keydeals-text-primary">{t('settings.whatsappTemplates')}</h2>
                <p className="text-sm text-keydeals-text-secondary mt-1">Customize the automated messages sent to clients and owners.</p>
              </div>
              
              <div className="p-6 space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-keydeals-text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" /> Client Visit Summary Template
                  </label>
                  <p className="text-xs text-keydeals-text-secondary/70">
                    Available variables: <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">[List: Property Type, Landmark, Price]</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{companyName}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{Contact Person}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{contactNumber}'}</code>
                  </p>
                  <textarea
                    required
                    rows={6}
                    value={formData.clientVisitTemplate}
                    onChange={(e) => setFormData({ ...formData, clientVisitTemplate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-mono text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-keydeals-text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" /> Property Owner Notification Template
                  </label>
                  <p className="text-xs text-keydeals-text-secondary/70">
                    Available variables: <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{ownerName}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{address}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{propertyType}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{price}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{companyName}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{Contact Person}'}</code>, <code className="bg-white/30 px-1.5 py-0.5 rounded text-blue-800">{'{contactNumber}'}</code>
                  </p>
                  <textarea
                    required
                    rows={8}
                    value={formData.propertyOwnerTemplate}
                    onChange={(e) => setFormData({ ...formData, propertyOwnerTemplate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-keydeals-border bg-white text-keydeals-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 mb-4">
                {error}
              </div>
            )}

            {/* Floating Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-keydeals-border md:static md:bg-transparent md:border-t-0 md:p-0 z-40 flex justify-center">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full md:w-64 flex items-center justify-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 text-keydeals-surface" />
                {isSaving ? 'Saving...' : t('buttons.save')}
              </button>
            </div>
          </form>

          {/* Feedback Form */}
          <div className="bg-keydeals-surface rounded-2xl border border-keydeals-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-keydeals-border bg-white/10">
              <h2 className="text-xl font-bold text-keydeals-text-primary">Feedback</h2>
              <p className="text-sm text-keydeals-text-secondary mt-1">Have a suggestion or found a bug? Let us know!</p>
            </div>
            <div className="p-6">
              <FeedbackForm />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('settings.signOut', 'Sign Out')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackForm() {
  const { user, addFeedback } = useProperties();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      addFeedback({
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Anonymous',
        email: user?.email || 'anonymous@example.com',
        message
      });
      setMessage('');
      setIsSubmitting(false);
      alert('Thank you for your feedback!');
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        required
        rows={4}
        placeholder="Type your feedback here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70"
      >
        <Mail className="w-4 h-4 text-keydeals-surface" />
        {isSubmitting ? 'Sending...' : 'Send Feedback'}
      </button>
    </form>
  );
}

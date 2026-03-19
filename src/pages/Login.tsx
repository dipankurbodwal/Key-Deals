import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Fingerprint, Mail, Lock, ArrowRight, UserPlus, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { motion, AnimatePresence } from 'motion/react';

type AuthView = 'landing' | 'signin' | 'signup';

const MOCK_DB = [
  { email: 'agent@keydeals.com', password: 'password123', name: 'Agent' },
  { email: '7keydeals@gmail.com', password: 'admin', name: 'Admin' }
];

export function Login() {
  const navigate = useNavigate();
  const { setUser, biometricsEnabled } = useProperties();
  const [view, setView] = useState<AuthView>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // View changed
  }, [view]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const userMatch = MOCK_DB.find(u => u.email === email && u.password === password);
    
    if (userMatch) {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        email: userMatch.email,
        name: userMatch.name,
        phone: '+1234567890',
        isAdmin: userMatch.email === '7keydeals@gmail.com',
        isSubscribed: true,
        onboardingCompleted: true,
        referralCount: 0,
        referralEarnedCount: 0
      });
      navigate('/');
    } else {
      const emailExists = MOCK_DB.some(u => u.email === email);
      if (!emailExists) {
        setError('Account not found. Would you like to Create an Account instead?');
      } else {
        setError('Invalid password. Please try again.');
      }
    }
  };

  const handleBiometricLogin = () => {
    setIsAuthenticating(true);
    // Simulate biometric auth
    setTimeout(() => {
      setUser({
        id: 'u1',
        email: 'agent@keydeals.com',
        name: 'Agent',
        phone: '+1234567890',
        isAdmin: false,
        isSubscribed: true,
        onboardingCompleted: true,
        referralCount: 0,
        referralEarnedCount: 0
      });
      setIsAuthenticating(false);
      navigate('/');
    }, 1500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Mock sign up
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      phone: '',
      isAdmin: false,
      isSubscribed: false,
      subscriptionStatus: 'inactive',
      onboardingCompleted: false,
      referralCount: 0,
      referralEarnedCount: 0
    });
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-keydeals-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 bg-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-700/20 overflow-hidden">
            <img src="/favicon.svg" alt="Logo" className="w-full h-full" />
          </div>
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center text-4xl font-black text-keydeals-text-primary tracking-tight"
        >
          Key Deals
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-center text-keydeals-text-secondary font-medium"
        >
          Professional Real Estate CRM
        </motion.p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-keydeals-surface py-10 px-6 shadow-2xl shadow-keydeals-border/20 sm:rounded-3xl border border-keydeals-border relative overflow-hidden">
          <AnimatePresence mode="wait">
            {view === 'landing' && (
              <motion.div
                key="landing"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <button
                    onClick={() => setView('signin')}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-blue-700 text-white rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </button>
                  <button
                    onClick={() => setView('signup')}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-blue-700 border-2 border-blue-700 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </button>

                  {biometricsEnabled && (
                    <div className="pt-4 border-t border-keydeals-border">
                      <button
                        onClick={handleBiometricLogin}
                        disabled={isAuthenticating}
                        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-emerald-50 text-emerald-700 border-2 border-emerald-200 rounded-2xl font-bold text-lg hover:bg-emerald-100 transition-all disabled:opacity-50"
                      >
                        {isAuthenticating ? (
                          <div className="w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Fingerprint className="w-6 h-6" />
                        )}
                        {isAuthenticating ? 'Authenticating...' : 'Biometric Sign In'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'signin' && (
              <motion.div
                key="signin"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <form className="space-y-6" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-keydeals-text-primary uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-keydeals-border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-keydeals-text-secondary"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-keydeals-text-primary uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-keydeals-border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-keydeals-text-secondary"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 rounded-2xl flex gap-3 items-start border border-red-100">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                        {error.includes('Create an Account') && (
                          <button
                            type="button"
                            onClick={() => setView('signup')}
                            className="text-sm text-red-700 font-bold underline"
                          >
                            Register now
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-keydeals-border text-blue-700 focus:ring-blue-500" defaultChecked />
                      <span className="text-sm text-keydeals-text-secondary group-hover:text-keydeals-text-primary transition-colors">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-bold text-blue-700 hover:text-blue-800">Forgot?</button>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('landing')}
                      className="w-full py-3 text-keydeals-text-secondary font-bold text-sm hover:text-keydeals-text-primary transition-colors"
                    >
                      Back to Start
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <form className="space-y-6" onSubmit={handleSignUp}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-keydeals-text-primary uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-keydeals-border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-keydeals-text-secondary"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-keydeals-text-primary uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-keydeals-border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-keydeals-text-secondary"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-keydeals-text-primary uppercase tracking-widest">Confirm Password</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-keydeals-text-secondary/50" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-keydeals-border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-keydeals-text-secondary"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 rounded-2xl flex gap-3 items-start border border-red-100">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-700 text-white rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20"
                    >
                      Create Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('landing')}
                      className="w-full py-3 text-keydeals-text-secondary font-bold text-sm hover:text-keydeals-text-primary transition-colors"
                    >
                      Back to Start
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

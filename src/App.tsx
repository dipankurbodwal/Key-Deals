/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PropertyDetails } from './pages/PropertyDetails';
import { Leads } from './pages/Leads';
import { Schedule } from './pages/Schedule';
import { AddProperty } from './pages/AddProperty';
import { AddClient } from './pages/AddClient';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';
import { Onboarding } from './pages/Onboarding';
import { Tools } from './pages/Tools';
import { Brokers } from './pages/Brokers';
import { RentalLeads } from './pages/RentalLeads';
import { PropertyRequired } from './pages/PropertyRequired';
import { Ads } from './pages/Ads';
import { Rentals } from './pages/Rentals';
import { Market } from './pages/Market';
import { Analytics } from './pages/Analytics';
import { Terms } from './pages/Terms';
import { AddRentalProperty } from './pages/AddRentalProperty';
import { RentalRequirements } from './pages/RentalRequirements';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ErrorBoundary } from './components/ErrorBoundary';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidMapsKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useProperties();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-keydeals-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002366]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!!user.onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
      <Route path="/edit-property/:id" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
      <Route path="/property/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
      <Route path="/add-client" element={<ProtectedRoute><AddClient /></ProtectedRoute>} />
      <Route path="/edit-client/:id" element={<ProtectedRoute><AddClient /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
      <Route path="/brokers" element={<ProtectedRoute><Brokers /></ProtectedRoute>} />
      <Route path="/rental-leads" element={<ProtectedRoute><RentalLeads /></ProtectedRoute>} />
      <Route path="/property-required" element={<ProtectedRoute><PropertyRequired /></ProtectedRoute>} />
      <Route path="/ads" element={<ProtectedRoute><Ads /></ProtectedRoute>} />
      <Route path="/rentals" element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
      <Route path="/rentals/add" element={<ProtectedRoute><AddRentalProperty /></ProtectedRoute>} />
      <Route path="/rentals/search" element={<ProtectedRoute><RentalRequirements /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PropertyProvider>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
          <Router>
            <AppRoutes />
          </Router>
        </APIProvider>
      </PropertyProvider>
    </ErrorBoundary>
  );
}

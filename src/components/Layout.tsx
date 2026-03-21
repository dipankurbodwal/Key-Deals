import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, Bell, Menu, X, Key, Settings, Shield, LogOut, Fingerprint, Calculator, MapPin, Megaphone, Search, Handshake, Globe, BarChart3 } from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '../lib/utils';
import { differenceInMinutes } from 'date-fns';
import { useProperties } from '../context/PropertyContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const { mode, setMode, user, setUser, globalLocation, setGlobalLocation, properties } = useProperties();
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const INDIAN_CITIES = [
    'All India', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad', 'Bareilly', 'Moradabad', 'Mysore', 'Gurugram', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Mira-Bhayandar', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Nellore', 'Jammu', 'Sangli-Miraj & Kupwad', 'Belgaum', 'Mangalore', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala', 'Rohtak'
  ];

  const filteredCities = INDIAN_CITIES.filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  useEffect(() => {
    // Biometric popup logic removed as per user request.
  }, [user]);

  const NAV_ITEMS = [
    { 
      name: mode === 'Professionals' ? 'My Inventory' : 'Marketplace', 
      path: '/', 
      icon: Home, 
      roles: ['Broker'] 
    },
    { name: 'Properties', path: '/', icon: Home, roles: ['Owner', 'Client', 'Developer', 'Property Owner'] },
    { name: 'Add Property', path: '/add-property', icon: Key, roles: ['Owner', 'Property Owner'] },
    { name: 'My Clients', path: '/leads', icon: Users, roles: ['Broker'] },
    { name: 'Brokers', path: '/brokers', icon: Shield, roles: ['Broker', 'Owner', 'Property Owner'] },
    { name: 'Ads', path: '/ads', icon: Megaphone, roles: ['Broker', 'Owner', 'Client', 'Developer', 'Property Owner'] },
    { name: 'Property Required', path: '/property-required', icon: Search, roles: ['Broker', 'Owner', 'Developer', 'Client', 'Property Owner'] },
    { name: 'Rental Leads', path: '/rental-leads', icon: Users, roles: ['Broker', 'Owner', 'Developer', 'Client', 'Property Owner'] },
    { name: 'Rentals', path: '/rentals', icon: Handshake, roles: ['Broker', 'Owner', 'Client', 'Developer', 'Property Owner'] },
    { name: 'Schedule', path: '/schedule', icon: Calendar, roles: ['Broker'] },
    { name: 'Tools', path: '/tools', icon: Calculator, roles: ['Broker', 'Owner', 'Client', 'Developer', 'Property Owner'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Broker', 'Owner', 'Client', 'Developer', 'Property Owner'] },
    ...(user?.isAdmin ? [{ name: 'Admin', path: '/admin', icon: Shield, roles: ['Broker', 'Owner', 'Client', 'Developer', 'Property Owner'] }] : [])
  ];

  const visibleNavItems = NAV_ITEMS.filter(item => {
    const userRole = user?.role || 'Guest';
    const hasRole = item.roles.includes(userRole as any);
    
    // Broker Sidebar: My Inventory, My Clients, Property Required, Rental, Rental Leads, Brokers, Ads, Schedule, Tools, Settings
    if (userRole === 'Broker') {
      if (mode === 'Marketplace') {
        const marketplacePaths = ['/', '/rentals', '/brokers', '/ads', '/tools', '/rental-leads', '/property-required'];
        return hasRole && marketplacePaths.includes(item.path);
      }
      return hasRole;
    }

    // Owner Sidebar: Marketplace (Properties), Add Property, Broker Directory, Ads, Property Required, Rental Leads, Tools, Settings
    if (userRole === 'Owner' || userRole === 'Property Owner') {
      const ownerPaths = ['/', '/add-property', '/brokers', '/ads', '/property-required', '/rental-leads', '/tools', '/settings'];
      return hasRole && ownerPaths.includes(item.path);
    }
    
    return hasRole;
  });

  // Force non-brokers to Marketplace mode
  useEffect(() => {
    if (user && user.role !== 'Broker' && mode !== 'Marketplace') {
      setMode('Marketplace');
    }
  }, [user, mode, setMode]);

  // Notification simulation logic
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const newNotifications: string[] = [];
      
      properties.forEach(prop => {
        if (prop.visitTime) {
          const visitDate = new Date(prop.visitTime);
          const diff = differenceInMinutes(visitDate, now);
          
          if (diff > 0 && diff <= 60) {
            newNotifications.push(`Upcoming visit for ${prop.title} in ${diff} minutes!`);
          }
        }
      });
      
      if (newNotifications.length > 0) {
        setNotifications(newNotifications);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [properties]);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-keydeals-bg flex flex-col md:flex-row font-sans text-keydeals-text-secondary">
      {/* Mobile Header */}
      <header className="md:hidden bg-keydeals-surface border-b border-keydeals-border p-4 flex items-center justify-between sticky top-0 z-20">
        <Logo size="sm" showText />
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-keydeals-text-primary" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-keydeals-text-primary">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-keydeals-surface border-r border-keydeals-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-xl md:shadow-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:flex">
          <Logo size="md" showText />
        </div>

        {/* Location Selector (Mobile) */}
        <div className="px-4 mb-4 md:hidden">
          <div className="relative">
            <button 
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl text-sm font-semibold text-keydeals-text-primary border border-keydeals-border"
            >
              <MapPin className="w-4 h-4 text-[#002366]" />
              <span className="truncate">{globalLocation}</span>
            </button>
            {showCityDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-keydeals-border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                <div className="sticky top-0 p-2 bg-white border-b border-keydeals-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-keydeals-text-secondary/50" />
                    <input 
                      type="text"
                      placeholder="Search city..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-keydeals-bg border-none rounded-lg text-sm focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                </div>
                {filteredCities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setGlobalLocation(city);
                      setShowCityDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-keydeals-bg transition-colors",
                      globalLocation === city ? "text-[#002366] font-bold bg-[#002366]/5" : "text-keydeals-text-secondary"
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Mode Toggle - Only for Brokers */}
        {user?.role === 'Broker' && (
          <div className="px-4 mt-16 md:mt-0 mb-4">
            <div className="bg-white/30 p-1 rounded-xl flex items-center border border-keydeals-border">
              <button
                onClick={() => setMode('Professionals')}
                className={cn(
                  "flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors",
                  mode === 'Professionals' ? "bg-[#002366] text-keydeals-surface shadow-sm" : "text-keydeals-text-primary hover:text-[#002366]"
                )}
              >
                Professionals
              </button>
              <button
                onClick={() => setMode('Marketplace')}
                className={cn(
                  "flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors",
                  mode === 'Marketplace' ? "bg-[#002366] text-keydeals-surface shadow-sm" : "text-keydeals-text-primary hover:text-[#002366]"
                )}
              >
                Marketplace
              </button>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-2 flex-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
                  isActive 
                    ? "bg-[#002366] text-keydeals-surface shadow-lg shadow-[#002366]/20" 
                    : "text-keydeals-text-primary hover:bg-white/20 hover:text-[#002366]"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-keydeals-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-[#002366] text-keydeals-surface flex items-center justify-center font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-keydeals-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-keydeals-text-secondary truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-keydeals-text-primary hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* Desktop Topbar */}
        <div className="hidden md:flex justify-between items-center mb-8">
          {/* Location Selector (Desktop) */}
          <div className="relative">
            <button 
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-keydeals-surface border border-keydeals-border rounded-xl shadow-sm hover:bg-white/40 transition-colors"
            >
              <MapPin className="w-5 h-5 text-[#002366]" />
              <span className="font-bold text-keydeals-text-primary">{globalLocation}</span>
            </button>
            {showCityDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-keydeals-border rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                <div className="sticky top-0 p-2 bg-white border-b border-keydeals-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-keydeals-text-secondary/50" />
                    <input 
                      type="text"
                      placeholder="Search city..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-keydeals-bg border-none rounded-lg text-sm focus:ring-2 focus:ring-[#002366]"
                    />
                  </div>
                </div>
                {filteredCities.map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setGlobalLocation(city);
                      setShowCityDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-keydeals-bg transition-colors",
                      globalLocation === city ? "text-[#002366] font-bold bg-[#002366]/5" : "text-keydeals-text-secondary"
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative group">
            <button className="p-2 rounded-full bg-keydeals-surface border border-keydeals-border shadow-sm hover:bg-white/40 transition-colors relative">
              <Bell className="w-5 h-5 text-[#002366]" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-keydeals-border p-4 hidden group-hover:block z-50">
                <h4 className="font-bold text-xs text-keydeals-text-primary uppercase tracking-wider mb-3">Reminders</h4>
                <div className="space-y-3">
                  {notifications.map((note, i) => (
                    <div key={i} className="text-sm p-3 bg-[#002366]/5 text-[#002366] rounded-lg border border-[#002366]/10">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {children}
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

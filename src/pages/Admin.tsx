import React, { useState, useMemo } from 'react';
import { useProperties } from '../context/PropertyContext';
import { 
  Search, Shield, User, Mail, Phone, CheckCircle, XCircle, X, 
  Users, CreditCard, Home, Globe, BarChart3, MessageSquare, 
  RefreshCw, TrendingUp, MapPin, DollarSign, Award
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

// Mock users for admin dashboard
const MOCK_USERS_LIST = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', subscriptionStatus: 'active', joinedAt: '2023-10-01', language: 'English', referralCount: 5, referralEarnedCount: 2 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', subscriptionStatus: 'inactive', joinedAt: '2023-11-15', language: 'Hindi', referralCount: 12, referralEarnedCount: 8 },
  { id: '3', name: 'Admin User', email: '7keydeals@gmail.com', phone: '+1122334455', subscriptionStatus: 'active', joinedAt: '2023-01-01', language: 'English', referralCount: 0, referralEarnedCount: 0 },
  { id: '4', name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+919876543210', subscriptionStatus: 'active', joinedAt: '2023-12-01', language: 'Marathi', referralCount: 3, referralEarnedCount: 1 },
  { id: '5', name: 'Priya Sharma', email: 'priya@example.com', phone: '+919876543211', subscriptionStatus: 'inactive', joinedAt: '2023-12-05', language: 'Telugu', referralCount: 8, referralEarnedCount: 4 },
];

export function Admin() {
  const { 
    user, properties, feedbacks, payments, adminSettings, 
    updateAdminSettings, refreshData 
  } = useProperties();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'accounts' | 'feedback'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS_LIST[0] | null>(null);
  const [revenueFilter, setRevenueFilter] = useState<'month' | 'lifetime'>('lifetime');
  
  // Only allow access if user is admin (email matches)
  if (user?.email !== '7keydeals@gmail.com') {
    return <Navigate to="/" replace />;
  }

  const filteredUsers = MOCK_USERS_LIST.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  // Metrics
  const totalUsers = MOCK_USERS_LIST.length;
  const activeSubscribers = MOCK_USERS_LIST.filter(u => u.subscriptionStatus === 'active').length;
  const totalProperties = properties.length;
  const marketplaceListings = properties.filter(p => p.is_published).length;

  // City Analytics
  const cityStats = useMemo(() => {
    const stats: Record<string, number> = {};
    properties.forEach(p => {
      const city = p.landmark || 'Unknown';
      stats[city] = (stats[city] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [properties]);

  // Language Analytics
  const languageStats = useMemo(() => {
    const stats: Record<string, number> = {};
    MOCK_USERS_LIST.forEach(u => {
      stats[u.language] = (stats[u.language] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [MOCK_USERS_LIST]);

  // Revenue Tracking
  const approvedPayments = payments.filter(p => p.status === 'approved');
  const totalEarnings = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const filteredPayments = useMemo(() => {
    if (revenueFilter === 'lifetime') return approvedPayments;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return approvedPayments.filter(p => new Date(p.date) >= startOfMonth);
  }, [approvedPayments, revenueFilter]);

  // Top Referrers
  const topReferrers = [...MOCK_USERS_LIST].sort((a, b) => b.referralCount - a.referralCount).slice(0, 5);

  const COLORS = ['#1d4ed8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-700 dark:text-slate-200 tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-700" /> Success Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Platform performance and management.</p>
        </div>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalUsers}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeSubscribers}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Active Subscribers</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Inventory</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalProperties}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Properties</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Public</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{marketplaceListings}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Marketplace Listings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: User },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'accounts', label: 'Accounts', icon: DollarSign },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-blue-700 text-blue-700' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Admin Controls */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Platform Controls</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Marketplace Subscription</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enable/disable marketplace access fees</p>
                  </div>
                  <button 
                    onClick={() => updateAdminSettings({ 
                      ...adminSettings, 
                      marketplaceSubscriptionEnabled: !adminSettings.marketplaceSubscriptionEnabled 
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      adminSettings.marketplaceSubscriptionEnabled ? 'bg-blue-700' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      adminSettings.marketplaceSubscriptionEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Marketplace Fee (₹)</label>
                    <input 
                      type="number" 
                      value={adminSettings.marketplaceSubscriptionAmount}
                      onChange={(e) => updateAdminSettings({ ...adminSettings, marketplaceSubscriptionAmount: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Ad Fee (₹)</label>
                    <input 
                      type="number" 
                      value={adminSettings.projectAdSubscriptionAmount}
                      onChange={(e) => updateAdminSettings({ ...adminSettings, projectAdSubscriptionAmount: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Top Referrers
              </h3>
              <div className="space-y-4">
                {topReferrers.map((ref, index) => (
                  <div key={ref.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{ref.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{ref.referralCount} referrals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                        {ref.referralEarnedCount} Earned
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Search and view user details.</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or phone..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Joined</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                            {u.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Mail className="w-4 h-4 text-slate-400" /> {u.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Phone className="w-4 h-4 text-slate-400" /> {u.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        {u.subscriptionStatus === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" /> Pro
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                            <XCircle className="w-3.5 h-3.5" /> Basic
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                        {new Date(u.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedUser(u)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* City Analytics */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> City & Regional Analytics
              </h3>
              <div className="space-y-4">
                {cityStats.map((city, index) => (
                  <div key={city.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-400">#{index + 1}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{city.name}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{city.count} properties</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Usage Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" /> Language Usage
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {languageStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {languageStats.map((lang, index) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{lang.name}: {lang.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 opacity-50" />
                  <TrendingUp className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-emerald-100 text-sm font-medium">Total Earnings</p>
                <h3 className="text-3xl font-bold mt-1">₹{totalEarnings.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subscription History</h3>
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                  <button 
                    onClick={() => setRevenueFilter('month')}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      revenueFilter === 'month' ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-white shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    This Month
                  </button>
                  <button 
                    onClick={() => setRevenueFilter('lifetime')}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      revenueFilter === 'lifetime' ? 'bg-white dark:bg-slate-600 text-blue-700 dark:text-white shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Lifetime
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold text-right">Amount</th>
                      <th className="p-4 font-semibold">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{p.userName}</td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="p-4 text-right font-bold text-emerald-600">₹{p.amount}</td>
                        <td className="p-4 text-sm font-mono text-slate-500 dark:text-slate-400">{p.transactionId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Feedback</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Recent suggestions and bug reports.</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {feedbacks.map(f => (
                <div key={f.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{f.userName}</span>
                      <span className="text-xs text-slate-400">• {new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{f.message}</p>
                </div>
              ))}
              {feedbacks.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  No feedback entries yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-3xl">
                {selectedUser.name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">User ID: {selectedUser.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Email</span>
                </div>
                <span className="text-slate-900 dark:text-white">{selectedUser.email}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Phone</span>
                </div>
                <span className="text-slate-900 dark:text-white">{selectedUser.phone}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Language</span>
                </div>
                <span className="text-slate-900 dark:text-white">{selectedUser.language}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Award className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">Referrals</span>
                </div>
                <span className="text-slate-900 dark:text-white">{selectedUser.referralCount} ({selectedUser.referralEarnedCount} earned)</span>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full py-3 px-4 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



import React, { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Store,
  Activity,
  Menu,
  X,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/admin/overview`, {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setOverview(data);
        } else {
          setError(data.message || 'Failed to load overview');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-gradient-to-br from-red-400 to-red-600 p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg mx-auto mb-4">
              <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Shops',
      value: overview?.totalShops ?? 0,
      icon: Store,
      
      iconBg: 'from-blue-400 to-blue-500',
      iconColor: 'text-white',
    },
    {
      title: 'Total Carts',
      value: overview?.totalCarts ?? 0,
      icon: ShoppingCart,
     
      iconBg: 'from-green-400 to-green-500',
      iconColor: 'text-white',
    },
    {
      title: 'Total Revenue',
      value: `₹${(overview?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      
      iconBg: 'from-purple-400 to-purple-500',
      iconColor: 'text-white',
    },
    {
      title: 'Active Users',
      value: overview?.activeUsers ?? 0,
      icon: Users,
     
      iconBg: 'from-orange-400 to-orange-500',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-gray-700"
        >
          {mobileMenuOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white p-6 pt-16">
          <div className="flex flex-col space-y-4">
            <button className="px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
              Dashboard
            </button>
            <button className="px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100">
              Users
            </button>
            <button className="px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100">
              Shops
            </button>
            <button className="px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100">
              Analytics
            </button>
            <button className="px-4 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-100">
              Settings
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 md:py-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg">
                <Activity className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>

                <h1 className="text-gray-600 text-xs md:text-base mt-1">
                  Welcome back! Here's what's happening with your platform.
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 w-full md:w-auto justify-between md:justify-normal">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-xl shadow-lg flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium text-xs md:text-sm">Live Data</span>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-2 md:p-3 rounded-xl shadow-sm">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
  {/* Stats */}
  <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-2 xl:grid-cols-4  xl:grid-rows-1 gap-4 md:gap-6 mb-6 md:mb-8">
    
    {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={i}
                className={`bg-gradient-to-br ${stat.gradient} text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 -mt-2 -mr-2 md:-mt-4 md:-mr-4 w-16 h-16 md:w-24 md:h-24 bg-white opacity-10 rounded-full" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 md:-mb-6 md:-ml-6 w-12 h-12 md:w-16 md:h-16 bg-white opacity-5 rounded-full" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-black opacity-80 text-xs md:text-sm font-medium mb-1 md:mb-2 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl lg:text-3xl text-black font-bold mb-1">{stat.value}</p>
                    <div className="flex items-center">
                      
                      <span className="text-xs text-black opacity-70">
                        +12% from last month
                      </span>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.iconBg} p-2 md:p-3 rounded-lg md:rounded-xl backdrop-blur-sm shadow-lg`}>
                    <IconComponent className="h-10 w-10 md:h-10 md:w-10 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-xl p-4 md:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg">
                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">System Alerts</h2>
                <p className="text-xs md:text-sm text-gray-500">Monitor your platform status</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-red-200">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-xs md:text-sm font-medium text-red-700">
                    {(overview?.alerts?.length || 0) > 0
                      ? `${overview.alerts.length} Active`
                      : '0 Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {overview?.alerts && overview.alerts.length > 0 ? (
            <div className="space-y-2 md:space-y-3">
              {overview.alerts.slice(0, 5).map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-3 md:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg md:rounded-xl hover:shadow-sm md:hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-lg shadow-lg">
                      <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-3 md:ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-yellow-800 truncate">
                      {typeof alert === 'string'
                        ? alert
                        : alert.message || 'System Alert'}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1 truncate">
                      Requires immediate attention
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <button className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-lg shadow-lg transition-colors hover:from-amber-500 hover:to-orange-600">
                      <Eye className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 md:p-4 rounded-xl md:rounded-2xl w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 flex items-center justify-center shadow-lg">
                <svg
                  className="h-8 w-8 md:h-10 md:w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                All Systems Operational
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                No alerts detected. Your platform is running perfectly.
              </p>
              <div className="mt-3 md:mt-4 flex items-center justify-center space-x-1 md:space-x-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs md:text-sm text-green-600 font-medium">
                  Status: Healthy
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;




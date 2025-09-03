

// src/components/AdminDashboard/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { 
  LogOut, 
  Bell,
  Search,
  Menu,
  User,
  BarChart3, 
  ShoppingCart, 
  Users as UsersIcon, 
  DollarSign, 
  Activity, 
  X, 
  ChevronRight, 
  Crown 
} from "lucide-react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <BarChart3 className="w-5 h-5" />, 
      path: '/admin/dashboard',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      description: 'System overview and metrics'
    },
    { 
      name: 'Carts', 
      icon: <ShoppingCart className="w-5 h-5" />, 
      path: '/admin/carts',
      color: 'from-purple-500 to-indigo-500',
      hoverColor: 'hover:from-purple-600 hover:to-indigo-600',
      description: 'Manage shopping carts'
    },
    { 
      name: 'Customers', 
      icon: <UsersIcon className="w-5 h-5" />, 
      path: '/admin/customers',
      color: 'from-pink-500 to-rose-500',
      hoverColor: 'hover:from-pink-600 hover:to-rose-600',
      description: 'View and manage customers'
    },
    { 
      name: 'Orders', 
      icon: <DollarSign className="w-5 h-5" />, 
      path: '/admin/orders',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      description: 'Process and track orders'
    },
    { 
      name: 'Analytics', 
      icon: <Activity className="w-5 h-5" />, 
      path: '/admin/analytics',
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'hover:from-amber-600 hover:to-orange-600',
      description: 'View business insights'
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 z-30 transition-transform duration-300 ease-in-out w-72 flex flex-col bg-gray-50 border-r border-gray-200/50 shadow-lg`}
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 border-b border-gray-200/50"
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: -5 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg"
            >
              <Crown className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Smart Shopping Cart</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200/50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              end
              className={({ isActive }) =>
                `block relative overflow-hidden rounded-xl transition-all ${
                  isActive ? 'shadow-lg' : 'hover:shadow-lg'
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    isActive 
                      ? `bg-gradient-to-br ${item.color} text-white`
                      : 'bg-white text-gray-700 hover:bg-white/90'
                  } ${item.hoverColor}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-br ${item.color}`
                    }`}>
                      {React.cloneElement(item.icon, {
                        className: `${item.icon.props.className} ${
                          isActive ? 'text-white' : 'text-white'
                        }`
                      })}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-t border-gray-200/50"
        >
          
        </motion.div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Overlay"
        />
      )}
    </>
  );
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get admin data from localStorage
  useEffect(() => {
    const fetchAdminData = () => {
      try {
        console.log('🔄 Fetching admin data...');
        
        // Get data from localStorage - use adminToken consistently
        const adminToken = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');
        const adminEmail = localStorage.getItem('adminEmail');
        
        console.log('📋 LocalStorage data:', {
          adminEmail,
          adminToken: adminToken ? 'Yes' : 'No',
          adminUser
        });
        
        // If no token, redirect to login
        if (!adminToken) {
          console.log('❌ No admin token found, redirecting to login');
          navigate('/admin/login');
          return;
        }
        
        // Mark as authenticated
        setIsAuthenticated(true);
        
        if (adminEmail) {
          setUserEmail(adminEmail);
        }
        
        // Try to get name from localStorage
        if (adminUser && adminUser !== '{}') {
          try {
            const userData = JSON.parse(adminUser);
            console.log('📦 Parsed user data from localStorage:', userData);
            
            if (userData.name) {
              setUserName(userData.name);
              console.log('✅ Using name from localStorage:', userData.name);
            }
          } catch (error) {
            console.error("❌ Error parsing user data:", error);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
        console.log('🏁 Finished loading admin data');
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    console.log('🚪 Logging out admin...');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminUser');
    console.log('🧹 Cleared admin localStorage');
    navigate('/admin/login');
  };

  // Show loading or nothing until authentication is checked
  if (!isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 rounded-md text-gray-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="bg-purple-500 rounded-lg w-10 h-10 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Smart Shopping System
              </h1>
              <p className="text-sm text-gray-600">Administrator</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
           
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-800">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User profile */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-800">
                  {isLoading ? "Loading..." : `Welcome, ${userName}!`}
                </p>
                <p className="text-xs text-gray-600">{userEmail}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-800 font-medium">
                  {userName ? userName.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
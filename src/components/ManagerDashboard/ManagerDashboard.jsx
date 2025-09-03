


import React, { useState, useEffect } from "react";
import { 
  LogOut, 
  Bell,
  Search,
  Menu,
  User,
  BarChart3, 
  Package, 
  Users as UsersIcon, 
  Gift, 
  DollarSign,
  Activity,
  X, 
  ChevronRight, 
  Store,
  TrendingUp
} from "lucide-react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const ManagerSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { 
      name: 'Store Overview', 
      icon: <BarChart3 className="w-5 h-5" />, 
      path: '/manager/overview',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      description: 'Store performance metrics'
    },
    { 
      name: 'Product Management', 
      icon: <Package className="w-5 h-5" />, 
      path: '/manager/products',
      color: 'from-purple-500 to-indigo-500',
      hoverColor: 'hover:from-purple-600 hover:to-indigo-600',
      description: 'Manage inventory and products'
    },
    { 
      name: 'Sales Analytics', 
      icon: <TrendingUp className="w-5 h-5" />, 
      path: '/manager/sales',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      description: 'View sales reports and trends'
    },
    { 
      name: 'Customer Insights', 
      icon: <UsersIcon className="w-5 h-5" />, 
      path: '/manager/customers',
      color: 'from-pink-500 to-rose-500',
      hoverColor: 'hover:from-pink-600 hover:to-rose-600',
      description: 'Customer data and analytics'
    },
    { 
      name: 'Promotions', 
      icon: <Gift className="w-5 h-5" />, 
      path: '/manager/promotions',
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'hover:from-amber-600 hover:to-orange-600',
      description: 'Manage offers and discounts'
    },
    { 
      name: 'Financial Reports', 
      icon: <DollarSign className="w-5 h-5" />, 
      path: '/manager/reports',
      color: 'from-teal-500 to-cyan-500',
      hoverColor: 'hover:from-teal-600 hover:to-cyan-600',
      description: 'Financial summaries and reports'
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
              <Store className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Manager Panel</h1>
              <p className="text-xs text-gray-500">Store Management</p>
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

const ManagerDashboardPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Manager");
  const [userEmail, setUserEmail] = useState("");
  const [userShop, setUserShop] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get user data from localStorage and fetch manager name from API
  useEffect(() => {
    const fetchManagerName = async () => {
      try {
        console.log('🔄 Fetching manager name...');
        
        // Get data from localStorage
        const managerToken = localStorage.getItem('managerToken');
        const managerUser = localStorage.getItem('managerUser');
        let managerEmail = localStorage.getItem('managerEmail');
        const managerId = localStorage.getItem('managerId');
        
        console.log('📋 LocalStorage data:', {
          managerEmail,
          managerId,
          managerToken: managerToken ? 'Yes' : 'No',
          managerUser
        });
        
        // If no token, redirect to login
        if (!managerToken) {
          console.log('❌ No manager token found, redirecting to login');
          navigate('/manager/login');
          return;
        }
        
        // Mark as authenticated
        setIsAuthenticated(true);
        
        // If no email in localStorage, try to get it from managerUser
        if (!managerEmail && managerUser && managerUser !== '{}') {
          try {
            const userData = JSON.parse(managerUser);
            if (userData.email) {
              managerEmail = userData.email;
              localStorage.setItem('managerEmail', managerEmail);
              console.log('📧 Retrieved email from managerUser:', managerEmail);
            }
            // Check for both 'id' and '_id' fields
            const managerIdFromUser = userData._id || userData.id;
            if (managerIdFromUser && !managerId) {
              localStorage.setItem('managerId', managerIdFromUser);
              setUserId(managerIdFromUser);
              console.log('🆔 Retrieved ID from managerUser:', managerIdFromUser);
            }
          } catch (error) {
            console.error("❌ Error parsing user data:", error);
          }
        }
        
        if (managerEmail) {
          setUserEmail(managerEmail);
          
          // Try to get name from localStorage first
          if (managerUser && managerUser !== '{}') {
            try {
              const userData = JSON.parse(managerUser);
              console.log('📦 Parsed user data from localStorage:', userData);
              
              if (userData.name) {
                setUserName(userData.name);
                setUserShop(userData.shop || "");
                // Set manager ID if available in userData (check both 'id' and '_id')
                const managerIdFromUser = userData._id || userData.id;
                if (managerIdFromUser && !managerId) {
                  localStorage.setItem('managerId', managerIdFromUser);
                  setUserId(managerIdFromUser);
                }
                console.log('✅ Using name from localStorage:', userData.name);
                return;
              }
            } catch (error) {
              console.error("❌ Error parsing user data:", error);
            }
          }
          
          // If not in localStorage, fetch from API
          if (managerToken && managerEmail) {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/manager/profile?email=${encodeURIComponent(managerEmail)}`;
            console.log('🌐 Fetching profile from API:', apiUrl);
            
            try {
              const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${managerToken}`
                }
              });
              
              console.log('📥 Profile API response:', { status: response.status });
              
              if (response.ok) {
                const data = await response.json();
                console.log('✅ Profile data received:', data);
                
                setUserName(data.name || "Manager");
                setUserShop(data.shop || "");
                
                // Store manager ID if available (check both 'id' and '_id')
                const managerIdFromApi = data._id || data.id;
                if (managerIdFromApi) {
                  localStorage.setItem('managerId', managerIdFromApi);
                  setUserId(managerIdFromApi);
                  console.log('💾 Stored manager ID:', managerIdFromApi);
                }
                
                // Update localStorage with the retrieved user data
                localStorage.setItem('managerUser', JSON.stringify({
                  email: managerEmail,
                  name: data.name,
                  shop: data.shop,
                  id: managerIdFromApi
                }));
                
                console.log('💾 Updated localStorage with profile data');
              } else {
                console.error("❌ Failed to fetch manager profile");
                setUserName("Manager");
              }
            } catch (error) {
              console.error("❌ Network error fetching profile:", error);
              setUserName("Manager");
            }
          }
        } else {
          console.log('❌ No manager email found anywhere');
          // If we have a token but no email, redirect to login
          if (managerToken) {
            console.log('⚠️ Token exists but no email, redirecting to login');
            localStorage.removeItem('managerToken');
            localStorage.removeItem('managerId');
            navigate('/manager/login');
          }
        }
      } catch (error) {
        console.error("❌ Error fetching manager name:", error);
        setUserName("Manager");
      } finally {
        setIsLoading(false);
        console.log('🏁 Finished loading manager data');
        console.log('👤 Manager ID:', userId);
        
        // Also log the shop information for debugging
        if (userShop) {
          console.log('🏪 Shop Information:');
          console.log('Shop ID:', userShop.id || 'Not available');
          console.log('Shop Name:', userShop.name || 'Not available');
        }
      }
    };

    fetchManagerName();
  }, [navigate, userId]);

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('managerToken');
    localStorage.removeItem('managerEmail');
    localStorage.removeItem('managerUser');
    localStorage.removeItem('managerId');
    console.log('🧹 Cleared localStorage');
    navigate('/manager/login');
  };

  // Show loading or nothing until authentication is checked
  if (!isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
            <div className="bg-blue-500 rounded-lg w-10 h-10 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Smart Shopping System
              </h1>
              <p className="text-sm text-gray-600">Store Manager</p>
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
                {userId && <p className="text-xs text-gray-500">ID: {userId}</p>}
                {userShop && userShop.name && <p className="text-xs text-gray-500">{userShop.name}</p>}
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-800 font-medium">
                  {userName ? userName.charAt(0).toUpperCase() : 'M'}
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
        <ManagerSidebar 
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

export default ManagerDashboardPage;
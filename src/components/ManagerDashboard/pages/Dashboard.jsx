import React, { useState, useEffect } from "react";
import { 
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Users,
  ShoppingCart,
  BarChart3,
  Package,
  Settings
} from "lucide-react";

const ManagerDashboardPage = () => {
  const [userName, setUserName] = useState("Manager");
  const [userEmail, setUserEmail] = useState("");
  const [userShop, setUserShop] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 24562,
    orders: 142,
    customers: 2845,
    tasks: 12
  });

  // Get user data from localStorage and fetch manager name from API
  useEffect(() => {
    const fetchManagerName = async () => {
      try {
        console.log('🔄 Fetching manager name...');
        
        // Get data from localStorage
        const managerToken = localStorage.getItem('managerToken');
        const managerUser = localStorage.getItem('managerUser');
        let managerEmail = localStorage.getItem('managerEmail');
        
        console.log('📋 LocalStorage data:', {
          managerEmail,
          managerToken: managerToken ? 'Yes' : 'No',
          managerUser
        });
        
        // If no email in localStorage, try to get it from managerUser
        if (!managerEmail && managerUser && managerUser !== '{}') {
          try {
            const userData = JSON.parse(managerUser);
            if (userData.email) {
              managerEmail = userData.email;
              localStorage.setItem('managerEmail', managerEmail);
              console.log('📧 Retrieved email from managerUser:', managerEmail);
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
                setIsLoading(false);
                console.log('✅ Using name from localStorage:', userData.name);
                return;
              }
            } catch (error) {
              console.error("❌ Error parsing user data:", error);
            }
          }
          
          // If not in localStorage, fetch from API
          if (managerToken && managerEmail) {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ' https://smartcart-backend-8pu4.onrender.com'}/api/manager/profile?email=${encodeURIComponent(managerEmail)}`;
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
                
                // Update localStorage with the retrieved user data
                localStorage.setItem('managerUser', JSON.stringify({
                  email: managerEmail,
                  name: data.name,
                  shop: data.shop
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
        }
      } catch (error) {
        console.error("❌ Error fetching manager name:", error);
        setUserName("Manager");
      } finally {
        setIsLoading(false);
        console.log('🏁 Finished loading manager data');
      }
    };

    fetchManagerName();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Only the dashboard content remains */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-100">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <p className="text-gray-500">Today: {new Date().toLocaleDateString()}</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">Total Revenue</h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">${stats.revenue.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% from last month
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">New Orders</h3>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">{stats.orders}</p>
              <p className="text-blue-600 text-sm mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8% from last week
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">Customers</h3>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">{stats.customers.toLocaleString()}</p>
              <p className="text-purple-600 text-sm mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +32 new today
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">Tasks</h3>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">{stats.tasks}</p>
              <p className="text-amber-600 text-sm mt-2">4 require attention</p>
            </div>
          </div>
          
          {/* Two column layout for charts and recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart (placeholder) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Revenue Overview</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Revenue chart will be displayed here</p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">New customer registration</p>
                      <p className="text-sm text-gray-500">John Doe signed up</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order completed</p>
                      <p className="text-sm text-gray-500">Order #4562 was delivered</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">New order placed</p>
                      <p className="text-sm text-gray-500">Order #4598 for $125.99</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Package className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">New Order</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Add Customer</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Reports</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <Settings className="w-8 h-8 text-amber-600 mb-2" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
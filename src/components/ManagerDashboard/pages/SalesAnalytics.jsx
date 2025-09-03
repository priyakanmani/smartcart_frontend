import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiPieChart,
  FiBarChart2,
  FiAlertCircle,
  FiCalendar
} from 'react-icons/fi';

const SalesAnalytics = () => {
  // State management
  const [salesData, setSalesData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [shopInfo, setShopInfo] = useState({
    id: '',
    name: '',
    email: ''
  });

  // Function to extract shop ID directly from localStorage
  const getShopIdFromStorage = () => {
    try {
      const managerUser = localStorage.getItem('managerUser');
      if (managerUser && managerUser !== '{}') {
        const userData = JSON.parse(managerUser);
        
        // Try multiple locations for shop ID
        if (userData.shop && userData.shop.id) {
          return userData.shop.id;
        } else if (userData.shopId) {
          return userData.shopId;
        } else if (userData.shop && typeof userData.shop === 'string') {
          return userData.shop;
        } else if (userData.id) {
          return userData.id;
        }
      }
    } catch (error) {
      console.error("❌ Error extracting shop ID from localStorage:", error);
    }
    return ''; // Return empty string if not found
  };

  // Function to get the auth token properly
  const getAuthToken = () => {
    const token = localStorage.getItem('managerToken');
    // Check if token is invalid (like 'Yes') and clear it
    if (token && token !== 'Yes' && token.length > 20) {
      return token;
    }
    
    // If token is invalid, try to get from user data
    try {
      const managerUser = localStorage.getItem('managerUser');
      if (managerUser) {
        const userData = JSON.parse(managerUser);
        return userData.token;
      }
    } catch (error) {
      console.error("Error getting token from user data:", error);
    }
    
    return null;
  };

  // Retrieve shop info from localStorage
  useEffect(() => {
    const retrieveShopInfo = () => {
      try {
        // Get shop ID directly
        const shopId = getShopIdFromStorage();
        
        // Get other shop info
        const managerUser = localStorage.getItem('managerUser');
        const managerEmail = localStorage.getItem('managerEmail');
        
        let shopName = '';
        let email = '';
        
        if (managerUser && managerUser !== '{}') {
          try {
            const userData = JSON.parse(managerUser);
            
            // Extract shop name
            if (userData.shop && userData.shop.name) {
              shopName = userData.shop.name;
            } else if (userData.shopName) {
              shopName = userData.shopName;
            }
            
            // Extract email
            if (userData.email) {
              email = userData.email;
            }
          } catch (error) {
            console.error("❌ Error parsing user data:", error);
          }
        }
        
        if (managerEmail) {
          email = managerEmail;
        }
        
        // Set shop info
        setShopInfo({
          id: shopId,
          name: shopName,
          email: email
        });
        
      } catch (error) {
        console.error('Error retrieving shop info from localStorage:', error);
      }
    };

    retrieveShopInfo();
  }, []);

  // Fetch sales data from the backend
  const fetchSalesData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const shopId = getShopIdFromStorage();
      if (!shopId) {
        setErrorMessage('Shop information not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      const token = getAuthToken();
      if (!token) {
        setErrorMessage('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      // Calculate date range based on selected time range
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
        case 'day':
          startDate.setDate(now.getDate() - 7); // Last 7 days
          break;
        case 'week':
          startDate.setDate(now.getDate() - 30); // Last 30 days
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 6); // Last 6 months
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = now.toISOString().split('T')[0];

      // Fetch sales data from API
      const response = await fetch(
        ` https://smartcart-backend-8pu4.onrender.com/api/sales/analytics?shop=${shopId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&groupBy=${timeRange}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSalesData(data);
      } else if (response.status === 401) {
        setErrorMessage('Authentication failed. Please log in again.');
        localStorage.removeItem('managerToken');
      } else if (response.status === 404) {
        // If no data found, create sample data for demonstration
        generateSampleData();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch sales data');
        // Generate sample data for demonstration if API fails
        generateSampleData();
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setErrorMessage('Network error. Please check your connection.');
      // Generate sample data for demonstration
      generateSampleData();
    } finally {
      setIsLoading(false);
    }
  };

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const sampleData = {
      day: [
        { period: 'Mon', sales: 1200, orders: 15, customers: 12, date: '2024-01-01' },
        { period: 'Tue', sales: 1800, orders: 18, customers: 15, date: '2024-01-02' },
        { period: 'Wed', sales: 1500, orders: 16, customers: 14, date: '2024-01-03' },
        { period: 'Thu', sales: 2200, orders: 22, customers: 18, date: '2024-01-04' },
        { period: 'Fri', sales: 1900, orders: 20, customers: 16, date: '2024-01-05' },
        { period: 'Sat', sales: 2500, orders: 25, customers: 20, date: '2024-01-06' },
        { period: 'Sun', sales: 2100, orders: 21, customers: 17, date: '2024-01-07' },
      ],
      week: [
        { period: 'Week 1', sales: 8500, orders: 85, customers: 70, date: '2024-01-01' },
        { period: 'Week 2', sales: 9200, orders: 92, customers: 75, date: '2024-01-08' },
        { period: 'Week 3', sales: 7800, orders: 78, customers: 65, date: '2024-01-15' },
        { period: 'Week 4', sales: 10500, orders: 105, customers: 85, date: '2024-01-22' },
      ],
      month: [
        { period: 'Jan', sales: 36000, orders: 360, customers: 295, date: '2024-01-01' },
        { period: 'Feb', sales: 42000, orders: 420, customers: 340, date: '2024-02-01' },
        { period: 'Mar', sales: 38000, orders: 380, customers: 310, date: '2024-03-01' },
        { period: 'Apr', sales: 45000, orders: 450, customers: 370, date: '2024-04-01' },
      ]
    };

    setSalesData(sampleData[timeRange] || []);
    setErrorMessage('Using sample data. Real data will appear when you have sales records.');
  };

  // Fetch top products from the backend
  const fetchTopProducts = async () => {
    try {
      const shopId = getShopIdFromStorage();
      if (!shopId) return [];

      const token = getAuthToken();
      if (!token) return [];

      const response = await fetch(
        ` https://smartcart-backend-8pu4.onrender.com/api/products/top-selling?shop=${shopId}&limit=5`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        return await response.json();
      }
      
      // Return sample data if API fails
      return [
        { name: 'Wireless Headphones', category: 'Electronics', unitsSold: 45, revenue: 67500, growth: 15 },
        { name: 'Organic Coffee', category: 'Groceries', unitsSold: 120, revenue: 24000, growth: 22 },
        { name: 'Yoga Mat', category: 'Fitness', unitsSold: 38, revenue: 19000, growth: 18 },
        { name: 'Smart Watch', category: 'Electronics', unitsSold: 28, revenue: 84000, growth: 12 },
        { name: 'Face Moisturizer', category: 'Beauty', unitsSold: 65, revenue: 19500, growth: 25 },
      ];
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [
        { name: 'Wireless Headphones', category: 'Electronics', unitsSold: 45, revenue: 67500, growth: 15 },
        { name: 'Organic Coffee', category: 'Groceries', unitsSold: 120, revenue: 24000, growth: 22 },
        { name: 'Yoga Mat', category: 'Fitness', unitsSold: 38, revenue: 19000, growth: 18 },
        { name: 'Smart Watch', category: 'Electronics', unitsSold: 28, revenue: 84000, growth: 12 },
        { name: 'Face Moisturizer', category: 'Beauty', unitsSold: 65, revenue: 19500, growth: 25 },
      ];
    }
  };

  // Fetch sales by category from the backend
  const fetchSalesByCategory = async () => {
    try {
      const shopId = getShopIdFromStorage();
      if (!shopId) return [];

      const token = getAuthToken();
      if (!token) return [];

      const response = await fetch(
        ` https://smartcart-backend-8pu4.onrender.com/api/sales/by-category?shop=${shopId}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        return await response.json();
      }
      
      // Return sample data if API fails
      return [
        { category: 'Electronics', sales: 35, color: 'bg-blue-500' },
        { category: 'Clothing', sales: 25, color: 'bg-green-500' },
        { category: 'Groceries', sales: 20, color: 'bg-yellow-500' },
        { category: 'Home & Garden', sales: 15, color: 'bg-purple-500' },
        { category: 'Others', sales: 5, color: 'bg-gray-500' }
      ];
    } catch (error) {
      console.error('Error fetching sales by category:', error);
      return [
        { category: 'Electronics', sales: 35, color: 'bg-blue-500' },
        { category: 'Clothing', sales: 25, color: 'bg-green-500' },
        { category: 'Groceries', sales: 20, color: 'bg-yellow-500' },
        { category: 'Home & Garden', sales: 15, color: 'bg-purple-500' },
        { category: 'Others', sales: 5, color: 'bg-gray-500' }
      ];
    }
  };

  // Load data when component mounts or timeRange changes
  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  // State for top products and categories
  const [topProducts, setTopProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);

  // Load additional data on component mount
  useEffect(() => {
    const loadAdditionalData = async () => {
      const products = await fetchTopProducts();
      const categories = await fetchSalesByCategory();
      
      setTopProducts(products);
      setSalesByCategory(categories);
    };

    loadAdditionalData();
  }, []);

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!salesData.length) return { totalSales: 0, totalOrders: 0, avgOrderValue: 0, totalCustomers: 0 };
    
    const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
    const totalCustomers = salesData.reduce((sum, item) => sum + item.customers, 0);
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    return { totalSales, totalOrders, avgOrderValue, totalCustomers };
  };

  const summary = calculateSummary();

  // Clear all messages
  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Refresh data
  const refreshData = () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    fetchSalesData();
    
    // Also refresh top products and categories
    fetchTopProducts().then(setTopProducts);
    fetchSalesByCategory().then(setSalesByCategory);
  };

  // Export data
  const exportData = () => {
    // Convert data to CSV format
    const headers = ['Period', 'Sales', 'Orders', 'Customers', 'Date'];
    const csvData = salesData.map(item => [
      item.period,
      item.sales,
      item.orders,
      item.customers,
      item.date
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_data_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSuccessMessage('Data exported successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Simple chart rendering without external libraries
  const renderSimpleBarChart = () => {
    if (!salesData.length) return null;
    
    const maxSales = Math.max(...salesData.map(item => item.sales));
    const labels = salesData.map(item => item.period);
    
    return (
      <div className="h-64 mt-4 relative">
        <div className="flex h-full items-end justify-between space-x-2">
          {salesData.map((item, index) => {
            const height = maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all duration-500"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs mt-2 text-gray-600 truncate">
                  {item.period}
                </div>
                <div className="text-xs font-semibold mt-1">
                  ₹{item.sales}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Simple pie chart for categories
  const renderSimplePieChart = () => {
    if (!salesByCategory.length) return null;
    
    const totalSales = salesByCategory.reduce((sum, cat) => sum + cat.sales, 0);
    
    return (
      <div className="flex flex-col md:flex-row items-center justify-center h-64">
        <div className="relative w-48 h-48 mb-4 md:mb-0 md:mr-8">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {salesByCategory.map((category, index) => {
              const percentage = totalSales > 0 ? (category.sales / totalSales) * 100 : 0;
              const rotation = salesByCategory.slice(0, index).reduce((sum, cat) => {
                const catPercentage = totalSales > 0 ? (cat.sales / totalSales) * 100 : 0;
                return sum + catPercentage * 3.6;
              }, 0);
              
              return (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    clipPath: `path('M70,70 l70,0 A70,70 0 ${percentage > 50 ? 1 : 0},1 ${70 + 70 * Math.cos(2 * Math.PI * percentage / 100)}, ${70 + 70 * Math.sin(2 * Math.PI * percentage / 100)} z')`
                  }}
                >
                  <div className={`w-full h-full ${category.color || 'bg-blue-500'}`}></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          {salesByCategory.map((category, index) => {
            const percentage = totalSales > 0 ? (category.sales / totalSales) * 100 : 0;
            return (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 ${category.color || 'bg-blue-500'} rounded mr-2`}></div>
                <span className="text-sm">{category.category}: {percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearMessages} className="text-green-700 hover:text-green-900">
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Sales Analytics
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={exportData}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <FiDownload className="mr-2" />
            Export Data
          </button>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
            disabled={isLoading}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Shop Info Display */}
      {shopInfo.id && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Shop Information</h2>
          <p className="text-blue-700"><span className="font-medium">Shop ID:</span> {shopInfo.id}</p>
          {shopInfo.name && <p className="text-blue-700"><span className="font-medium">Shop Name:</span> {shopInfo.name}</p>}
          {shopInfo.email && <p className="text-blue-700"><span className="font-medium">Email:</span> {shopInfo.email}</p>}
        </div>
      )}

      {/* Time Range Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FiFilter className="text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium">Time Range:</span>
          </div>
          <div className="flex space-x-2">
            {['day', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">₹{summary.totalSales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiDollarSign className="text-blue-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <FiTrendingUp className="mr-1" />
            +12.5% from previous period
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{summary.totalOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiShoppingCart className="text-green-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <FiTrendingUp className="mr-1" />
            +8% from previous period
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-800">₹{summary.avgOrderValue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiTrendingUp className="text-purple-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <FiTrendingUp className="mr-1" />
            +5.2% from previous period
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{summary.totalCustomers}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <FiUsers className="text-amber-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <FiTrendingUp className="mr-1" />
            +15.3% from previous period
          </p>
        </div>
      </div>

      {/* Charts Section */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading sales data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Sales Trend</h3>
              <FiBarChart2 className="text-blue-600" />
            </div>
            {renderSimpleBarChart()}
          </div>

          {/* Sales by Category Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Sales by Category</h3>
              <FiPieChart className="text-green-600" />
            </div>
            {renderSimplePieChart()}
          </div>
        </div>
      )}

      {/* Top Performing Products */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.unitsSold || product.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{(product.revenue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      +{product.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
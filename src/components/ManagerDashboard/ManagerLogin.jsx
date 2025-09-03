import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Store, AlertCircle, Loader2 } from 'lucide-react';
import {jwtDecode} from "jwt-decode";

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Just for debugging if a token already exists
  const token = localStorage.getItem("managerToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("🔑 Already logged in. Decoded JWT:", decoded);
    } catch (err) {
      console.error("❌ Failed to decode stored token:", err);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    console.log('🔐 Login attempt:', { email, password: '••••••••' });

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/manager/login`;
      console.log('🌐 Making API request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📥 API response:', { status: response.status, data });
      
      if (response.ok) {
        // Store authentication data
        if (data.token) {
          localStorage.setItem('managerToken', data.token);
          localStorage.setItem('managerEmail', email);

          // ✅ Decode JWT and store shopId
          try {
            const decoded = jwtDecode(data.token);
            console.log("🪪 Decoded JWT:", decoded);

            if (decoded.shopId) {
              localStorage.setItem('shopId', decoded.shopId);
              console.log("🏪 Saved shopId from token:", decoded.shopId);
            }
          } catch (err) {
            console.error("❌ Failed to decode token:", err);
          }

          // Store manager data if available
          if (data.manager) {
            localStorage.setItem('managerUser', JSON.stringify(data.manager));
            console.log('💾 Stored manager data:', data.manager);
          }

          console.log('💾 Stored in localStorage:', {
            token: data.token ? 'Yes' : 'No',
            email: email,
            manager: data.manager ? 'Yes' : 'No',
            shopId: localStorage.getItem('shopId') || 'Not found'
          });
        }
        
        setMessage('Login successful! Redirecting...');
        console.log('✅ Login successful, redirecting to /manager/overview');
        setTimeout(() => navigate('/manager/overview'), 1000);
      } else {
        setMessage(data.message || 'Login failed');
        console.log('❌ Login failed:', data.message);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('❌ Network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100"
      >
        {/* Branding Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div 
            whileHover={{ rotate: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl w-24 h-24 flex items-center justify-center mb-6 shadow-lg"
          >
            <Store className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Manager <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Portal</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Access your management dashboard
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="manager@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log('📝 Email changed:', e.target.value);
                }}
                required
                className="w-full pl-11 pr-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
              />
            </motion.div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  console.log('👁️ Password visibility:', !showPassword ? 'Visible' : 'Hidden');
                }}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" /> Show
                  </>
                )}
              </button>
            </div>
            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  console.log('📝 Password changed:', '••••••••');
                }}
                required
                className="w-full pl-11 pr-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none"
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-center font-medium flex items-center justify-center ${
                message.includes('successful')
                  ? 'bg-green-50/80 text-green-800 border-2 border-green-200'
                  : 'bg-red-50/80 text-red-800 border-2 border-red-200'
              }`}
            >
              {message.includes('failed') || message.includes('error') ? (
                <AlertCircle className="w-5 h-5 mr-2" />
              ) : null}
              {message}
            </motion.div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
          <p className="flex items-center justify-center">
            <Lock className="w-4 h-4 mr-1.5" />
            Manager access only • Contact admin for assistance
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ManagerLogin;

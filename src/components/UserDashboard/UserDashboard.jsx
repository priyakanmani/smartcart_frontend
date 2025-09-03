// src/components/UserDashboard/UserDashboard.jsx
import { useState } from 'react';
import { ShoppingCart, LogOut, Home, Gift, Clock, HelpCircle } from 'lucide-react';
import Cart from './Cart';
import OrderSummary from './OrderSummary';

const UserDashboard = ({ userName, handleLogout, cartItems, updateQuantity, removeItem, calculateTotals }) => {
  const [activeUserTab, setActiveUserTab] = useState('home');

  // ✅ Ensure totals always return safe defaults
  const safeTotals = calculateTotals?.() || { subtotal: 0, tax: 0, total: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            <h1 className="text-xl font-bold">SmartCart</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
              Sign In
            </button>
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
              Sign Up
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-20 bg-white shadow-sm">
          <div className="flex flex-col items-center py-6 space-y-6">
            <button
              onClick={() => setActiveUserTab('home')}
              className={`p-3 rounded-lg transition-colors ${
                activeUserTab === 'home' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-6 h-6" />
            </button>
            <div className="text-xs text-gray-500">Home</div>

            <button
              onClick={() => setActiveUserTab('offers')}
              className={`p-3 rounded-lg transition-colors ${
                activeUserTab === 'offers' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Gift className="w-6 h-6" />
            </button>
            <div className="text-xs text-gray-500">Offers</div>

            <button
              onClick={() => setActiveUserTab('history')}
              className={`p-3 rounded-lg transition-colors ${
                activeUserTab === 'history' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-6 h-6" />
            </button>
            <div className="text-xs text-gray-500">History</div>

            <button
              onClick={() => setActiveUserTab('help')}
              className={`p-3 rounded-lg transition-colors ${
                activeUserTab === 'help' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HelpCircle className="w-6 h-6" />
            </button>
            <div className="text-xs text-gray-500">Help</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <Cart cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />
          <OrderSummary cartItems={cartItems} totals={safeTotals} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

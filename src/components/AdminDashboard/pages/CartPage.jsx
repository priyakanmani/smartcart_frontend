import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  AlertTriangle, 
  Star, 
  MessageSquare,
  BatteryCharging,
  MapPin,
  ChevronRight,
  Plus,
  Check,
  X,
  RotateCw,
  HardDrive,
  User,
  Activity,
  Barcode,
  Trash2,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? ' https://smartcart-backend-8pu4.onrender.com/api' 
  : '/api';

const CartDashboard = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCart, setSelectedCart] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddComplaint, setShowAddComplaint] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    type: '',
    description: '',
    reported_by: ''
  });
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    customer_id: '',
    rating: 5,
    comment: ''
  });
  const [showAddCart, setShowAddCart] = useState(false);
  const [newCart, setNewCart] = useState({ cart_id: '' });
  const [showEditCart, setShowEditCart] = useState(false);
  const [editCart, setEditCart] = useState({
    cart_id: '',
    status: '',
    location: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cartToDelete, setCartToDelete] = useState(null);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/carts`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch carts');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }

      const data = await response.json();
      setCarts(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An error occurred while loading carts');
    } finally {
      setLoading(false);
    }
  };

  const updateCartStatus = async (cartId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${cartId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      const updatedCart = await response.json();
      setCarts(carts.map(cart => 
        cart.cart_id === cartId ? { ...cart, status } : cart
      ));
      
      if (selectedCart?.cart_id === cartId) {
        setSelectedCart({ ...selectedCart, status });
      }
    } catch (err) {
      console.error('Update status error:', err);
      setError(err.message);
    }
  };

  const handleAddComplaint = async () => {
    if (!newComplaint.type) {
      setError('Complaint type is required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/carts/${selectedCart.cart_id}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add complaint');
      }

      const updatedCart = await response.json();
      setSelectedCart(updatedCart);
      setShowAddComplaint(false);
      setNewComplaint({ type: '', description: '', reported_by: '' });
    } catch (err) {
      console.error('Add complaint error:', err);
      setError(err.message);
    }
  };

  const handleAddReview = async () => {
    if (!newReview.customer_id || !newReview.rating) {
      setError('Customer ID and rating are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/carts/${selectedCart.cart_id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add review');
      }

      const updatedCart = await response.json();
      setSelectedCart(updatedCart);
      setShowAddReview(false);
      setNewReview({ customer_id: '', rating: 5, comment: '' });
    } catch (err) {
      console.error('Add review error:', err);
      setError(err.message);
    }
  };

  const resolveComplaint = async (complaintIndex) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/carts/${selectedCart.cart_id}/complaints/${complaintIndex}/resolve`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resolve complaint');
      }

      const updatedCart = await response.json();
      setSelectedCart(updatedCart);
    } catch (err) {
      console.error('Resolve complaint error:', err);
      setError(err.message);
    }
  };

  const handleAddCart = async () => {
    if (!newCart.cart_id) {
      setError('Cart ID is required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: newCart.cart_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add cart');
      }

      const createdCart = await response.json();
      setCarts([...carts, createdCart]);
      setSelectedCart(createdCart);
      setShowAddCart(false);
      setNewCart({ cart_id: '' });
    } catch (err) {
      console.error('Add cart error:', err);
      setError(err.message);
    }
  };

  const handleEditCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${editCart.cart_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editCart.status,
          location: editCart.location
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart');
      }

      const updatedCart = await response.json();
      setCarts(carts.map(cart => 
        cart.cart_id === updatedCart.cart_id ? updatedCart : cart
      ));
      setSelectedCart(updatedCart);
      setShowEditCart(false);
    } catch (err) {
      console.error('Edit cart error:', err);
      setError(err.message);
    }
  };

  const deleteCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${cartToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete cart');
      }

      setCarts(carts.filter(cart => cart.cart_id !== cartToDelete));
      if (selectedCart?.cart_id === cartToDelete) {
        setSelectedCart(null);
      }
      setShowDeleteConfirm(false);
      setCartToDelete(null);
    } catch (err) {
      console.error('Delete cart error:', err);
      setError(err.message);
    }
  };

  const openEditModal = (cart) => {
    setEditCart({
      cart_id: cart.cart_id,
      status: cart.status,
      location: cart.location
    });
    setShowEditCart(true);
  };

  const confirmDelete = (cartId) => {
    setCartToDelete(cartId);
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600 text-lg">Loading Carts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Carts</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ rotate: -5 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg"
          >
            <ShoppingCart className="w-8 h-8 text-white" />
          </motion.div>
          <div>
           
            <p className="text-xl text-gray-600">Manage shopping carts and maintenance</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <span className="font-medium text-sm">
              {carts.length} {carts.length === 1 ? 'Cart' : 'Carts'}
            </span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddCart(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cart</span>
          </motion.button>
        </div>
      </div>

      {/* Add Cart Modal */}
      <AnimatePresence>
        {showAddCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Cart</h2>
                <button onClick={() => setShowAddCart(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cart ID</label>
                  <input
                    type="text"
                    value={newCart.cart_id}
                    onChange={(e) => setNewCart({...newCart, cart_id: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter cart ID"
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddCart(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddCart}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  >
                    Add Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Cart Modal */}
      <AnimatePresence>
        {showEditCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Cart #{editCart.cart_id}</h2>
                <button onClick={() => setShowEditCart(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editCart.status}
                    onChange={(e) => setEditCart({...editCart, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editCart.location}
                    onChange={(e) => setEditCart({...editCart, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter location"
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditCart(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditCart}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Cart #{cartToDelete}?</h3>
                <p className="text-gray-600 mb-6">This action cannot be undone. All data associated with this cart will be permanently removed.</p>
                <div className="flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={deleteCart}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Delete Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Carts</h2>
            
            <div className="space-y-3">
              {carts.map(cart => (
                <motion.div
                  key={cart.cart_id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCart(cart)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedCart?.cart_id === cart.cart_id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        cart.status === 'Available' ? 'bg-green-100 text-green-600' :
                        cart.status === 'In Use' ? 'bg-blue-100 text-blue-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Cart #{cart.cart_id}</h3>
                        <p className="text-sm text-gray-500">
                          {cart.items?.length || 0} items • ₹{cart.revenue?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Details */}
        {selectedCart ? (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cart #{selectedCart.cart_id}
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCart.status === 'Available' ? 'bg-green-100 text-green-800' :
                      selectedCart.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCart.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Active since {new Date(selectedCart.start_time).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openEditModal(selectedCart)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmDelete(selectedCart.cart_id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </motion.button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {['overview', 'complaints', 'reviews', 'maintenance', 'alerts'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-indigo-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-indigo-800">Cart Summary</h3>
                        <ShoppingCart className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-indigo-600">Current Status</p>
                          <p className="font-medium">{selectedCart.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-600">Location</p>
                          <p className="font-medium">{selectedCart.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-600">Items in Cart</p>
                          <p className="font-medium">{selectedCart.items?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-600">Total Revenue</p>
                          <p className="font-medium">₹{selectedCart.revenue?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-600">Active Since</p>
                          <p className="font-medium">
                            {new Date(selectedCart.start_time).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-800">Quick Stats</h3>
                          <Activity className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-600">Open Complaints</p>
                            <p className="font-medium text-blue-800">
                              {selectedCart.complaints?.filter(c => c.status === 'Pending').length || 0}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-green-600">Avg. Rating</p>
                            <p className="font-medium text-green-800">
                              {selectedCart.reviews?.length > 0
                                ? (selectedCart.reviews.reduce((sum, review) => sum + review.rating, 0) /
                                    selectedCart.reviews.length).toFixed(1)
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-sm text-purple-600">Maintenance</p>
                            <p className="font-medium text-purple-800">
                              {selectedCart.maintenance_history?.length || 0}
                            </p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3">
                            <p className="text-sm text-yellow-600">Active Alerts</p>
                            <p className="font-medium text-yellow-800">
                              {selectedCart.alerts?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-800">Recent Items</h3>
                          <HardDrive className="w-5 h-5 text-gray-600" />
                        </div>
                        {selectedCart.items?.length > 0 ? (
                          <ul className="space-y-2">
                            {selectedCart.items.slice(0, 3).map((item, index) => (
                              <li key={index} className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-700">{item.name || `Item ${index + 1}`}</span>
                                <span className="text-gray-900 font-medium">₹{item.price?.toFixed(2) || '0.00'}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">No items in cart history</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Complaints Tab */}
                {activeTab === 'complaints' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-medium text-gray-800">Complaint History</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddComplaint(true)}
                        className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Complaint</span>
                      </motion.button>
                    </div>

                    {showAddComplaint && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm"
                      >
                        <h4 className="font-medium text-gray-800 mb-3">New Complaint</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Type</label>
                            <select
                              value={newComplaint.type}
                              onChange={(e) => setNewComplaint({...newComplaint, type: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">Select type</option>
                              <option value="Wheel Issue">Wheel Issue</option>
                              <option value="Scanner Fault">Scanner Fault</option>
                              <option value="Battery Low">Battery Low</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Description</label>
                            <textarea
                              value={newComplaint.description}
                              onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              rows="3"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Reported By</label>
                            <input
                              type="text"
                              value={newComplaint.reported_by}
                              onChange={(e) => setNewComplaint({...newComplaint, reported_by: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowAddComplaint(false)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleAddComplaint}
                              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                            >
                              Submit
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {selectedCart.complaints?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCart.complaints.map((complaint, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className={`p-1 rounded ${
                                    complaint.type === 'Wheel Issue' ? 'bg-blue-100 text-blue-600' :
                                    complaint.type === 'Scanner Fault' ? 'bg-purple-100 text-purple-600' :
                                    complaint.type === 'Battery Low' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {complaint.type === 'Wheel Issue' && <RotateCw className="w-4 h-4" />}
                                    {complaint.type === 'Scanner Fault' && <Barcode className="w-4 h-4" />}
                                    {complaint.type === 'Battery Low' && <BatteryCharging className="w-4 h-4" />}
                                    {!['Wheel Issue', 'Scanner Fault', 'Battery Low'].includes(complaint.type) && 
                                      <AlertTriangle className="w-4 h-4" />}
                                  </div>
                                  <h4 className="font-medium text-gray-800">{complaint.type}</h4>
                                </div>
                                {complaint.description && (
                                  <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Reported by: {complaint.reported_by || 'Unknown'}</span>
                                  <span>
                                    {new Date(complaint.date_reported).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                {complaint.status === 'Pending' ? (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => resolveComplaint(index)}
                                    className="flex items-center space-x-1 bg-green-600 text-white px-2 py-1 rounded-lg text-xs"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Resolve</span>
                                  </motion.button>
                                ) : (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs">
                                    Resolved
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <AlertTriangle className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Complaints Found
                        </h3>
                        <p className="text-gray-600">
                          {showAddComplaint 
                            ? "Fill out the form above to add a complaint"
                            : "Click 'Add Complaint' to report an issue"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-medium text-gray-800">Customer Reviews</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddReview(true)}
                        className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Review</span>
                      </motion.button>
                    </div>

                    {showAddReview && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm"
                      >
                        <h4 className="font-medium text-gray-800 mb-3">New Review</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Customer ID</label>
                            <input
                              type="text"
                              value={newReview.customer_id}
                              onChange={(e) => setNewReview({...newReview, customer_id: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Rating</label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  type="button"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setNewReview({...newReview, rating: star})}
                                  className={`p-1 ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                  <Star className="w-5 h-5 fill-current" />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Comment</label>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              rows="3"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowAddReview(false)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleAddReview}
                              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                            >
                              Submit
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {selectedCart.reviews?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCart.reviews.map((review, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="bg-indigo-100 p-2 rounded-full">
                                  <User className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    Customer {review.customer_id || 'Anonymous'}
                                  </h4>
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <MessageSquare className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Reviews Yet
                        </h3>
                        <p className="text-gray-600">
                          {showAddReview 
                            ? "Fill out the form above to add a review"
                            : "Click 'Add Review' to submit customer feedback"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Maintenance Tab */}
                {activeTab === 'maintenance' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-medium text-gray-800">Maintenance History</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setNewComplaint({
                            type: 'Maintenance',
                            description: '',
                            reported_by: 'Technician'
                          });
                          setShowAddComplaint(true);
                        }}
                        className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Log Maintenance</span>
                      </motion.button>
                    </div>

                    {selectedCart.maintenance_history?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCart.maintenance_history.map((maintenance, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="p-1 rounded bg-blue-100 text-blue-600">
                                    <Wrench className="w-4 h-4" />
                                  </div>
                                  <h4 className="font-medium text-gray-800">{maintenance.type || 'General Maintenance'}</h4>
                                </div>
                                {maintenance.description && (
                                  <p className="text-sm text-gray-600 mb-2">{maintenance.description}</p>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Performed by: {maintenance.technician || 'Unknown'}</span>
                                  <span>
                                    {new Date(maintenance.date_performed).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs">
                                  Completed
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <Wrench className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Maintenance Records
                        </h3>
                        <p className="text-gray-600">
                          Maintenance activities will appear here when logged
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Alerts Tab */}
                {activeTab === 'alerts' && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-6">System Alerts</h3>

                    {selectedCart.alerts?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCart.alerts.map((alert, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white border rounded-xl p-4 shadow-sm ${
                              alert.severity === 'High' 
                                ? 'border-red-200 bg-red-50' 
                                : alert.severity === 'Medium'
                                ? 'border-yellow-200 bg-yellow-50'
                                : 'border-blue-200 bg-blue-50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className={`p-1 rounded ${
                                    alert.severity === 'High' 
                                      ? 'bg-red-100 text-red-600' 
                                      : alert.severity === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    <AlertTriangle className="w-4 h-4" />
                                  </div>
                                  <h4 className="font-medium text-gray-800">{alert.type}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>
                                    {new Date(alert.timestamp).toLocaleString()}
                                  </span>
                                  <span>
                                    Severity: {alert.severity}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-lg text-xs ${
                                  alert.status === 'Resolved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {alert.status}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <AlertTriangle className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Active Alerts
                        </h3>
                        <p className="text-gray-600">
                          System alerts will appear here when detected
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 sm:col-span-2  flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
            >
              <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Cart Selected</h3>
              <p className="text-gray-600 mb-6">
                Please select a cart from the list to view details and manage its status
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCart(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Add New Cart
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDashboard;
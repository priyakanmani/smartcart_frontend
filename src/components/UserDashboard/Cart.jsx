// src/components/UserDashboard/Cart.jsx
import { Minus, Plus, Trash2, ShoppingBag, Search, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';

const Cart = ({ cartItems = [], updateQuantity, removeItem, addItem }) => {
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample products that can be added to cart
  const availableProducts = [
    {
      id: 101,
      name: "Organic Bananas",
      unit: "1 kg",
      price: 49.99,
      originalPrice: 59.99,
      savings: 10.00,
      image: "🍌",
      category: "Fruits"
    },
    {
      id: 102,
      name: "Fresh Milk",
      unit: "1 Liter",
      price: 65.00,
      originalPrice: 65.00,
      savings: 0,
      image: "🥛",
      category: "Dairy"
    },
    {
      id: 103,
      name: "Whole Wheat Bread",
      unit: "500g",
      price: 45.00,
      originalPrice: 50.00,
      savings: 5.00,
      image: "🍞",
      category: "Bakery"
    },
    {
      id: 104,
      name: "Instant Noodles",
      unit: "Pack of 5",
      price: 75.00,
      originalPrice: 100.00,
      savings: 25.00,
      image: "🍜",
      category: "Snacks"
    },
    {
      id: 105,
      name: "Free Range Eggs",
      unit: "Dozen",
      price: 99.00,
      originalPrice: 110.00,
      savings: 11.00,
      image: "🥚",
      category: "Dairy"
    },
    {
      id: 106,
      name: "Tomatoes",
      unit: "500g",
      price: 25.00,
      originalPrice: 30.00,
      savings: 5.00,
      image: "🍅",
      category: "Vegetables"
    }
  ];

  // Filter products based on search query
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
              Your Smart Cart
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            
            <button
              onClick={() => setShowAddProducts(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Products
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some items to get started</p>
              <button
                onClick={() => setShowAddProducts(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-colors mx-auto"
              >
                <PlusCircle className="w-5 h-5" />
                Add Products
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const {
                id,
                name = 'Unnamed Item',
                unit = '',
                price = 0,
                originalPrice = 0,
                savings = 0,
                quantity = 0,
                image = ''
              } = item;

              return (
                <div key={id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                      {image || '📦'}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{name}</h3>
                      <p className="text-sm text-gray-600">{unit}</p>
                      {savings > 0 && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          Save ₹{savings.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{price.toFixed(2)}</p>
                        {originalPrice > price && (
                          <p className="text-sm text-gray-500 line-through">
                            ₹{originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(id)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(id, -1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(id, 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Products Modal */}
        {showAddProducts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Add Products to Cart</h3>
                <button
                  onClick={() => setShowAddProducts(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1 p-4">
                <div className="grid grid-cols-1 gap-3">
                  {filteredProducts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No products found</p>
                  ) : (
                    filteredProducts.map(product => (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                            {product.image}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.unit}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-gray-800">₹{product.price.toFixed(2)}</p>
                            {product.originalPrice > product.price && (
                              <p className="text-sm text-gray-500 line-through">
                                ₹{product.originalPrice.toFixed(2)}
                              </p>
                            )}
                            {product.savings > 0 && (
                              <p className="text-sm text-green-600 font-medium">
                                Save ₹{product.savings.toFixed(2)}
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              addItem(product);
                              setShowAddProducts(false);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <PlusCircle className="w-4 h-4" />
                            Add
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
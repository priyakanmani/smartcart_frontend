
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiShoppingCart, FiAlertCircle } from 'react-icons/fi';

const ProductManagement = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    barcode: '',
    image: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for shop info
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
          return userData.shop.id; // "SARASU001"
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

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
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

        const response = await fetch(` https://smartcart-backend-8pu4.onrender.com/api/products?shop=${shopId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
          
          // Extract categories
          const uniqueCategories = [...new Set(data.map(product => product.category))];
          setCategories(uniqueCategories);
        } else if (response.status === 401) {
          setErrorMessage('Authentication failed. Please log in again.');
          // Clear invalid token
          localStorage.removeItem('managerToken');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Network error. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // Filter products based on search and category
  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Handle product submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Get shop ID directly from localStorage
      const shopId = getShopIdFromStorage();
      
      if (!shopId) {
        setErrorMessage('Shop information not found. Please log in again.');
        return;
      }
      
      // Get auth token
      const token = getAuthToken();
      if (!token) {
        setErrorMessage('Authentication token not found. Please log in again.');
        return;
      }
      
      // Prepare the product data with the correct shop ID
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        shop: shopId // This ensures the shop ID is always included
      };
      
      // Convert empty barcode to undefined to avoid validation issues
      if (productData.barcode === '') {
        delete productData.barcode;
      }
      
      if (editingProduct) {
        // Update product - ensure shop ID is included
        const updateData = {
          ...productData,
          shop: shopId // Re-add shop ID to be sure
        };
        
        const response = await fetch(` https://smartcart-backend-8pu4.onrender.com/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData),
        });
        
        if (response.ok) {
          const updatedProduct = await response.json();
          setProducts(products.map(product => 
            product._id === updatedProduct._id ? updatedProduct : product
          ));
          setSuccessMessage('Product updated successfully!');
        } else {
          const errorData = await response.json();
          if (errorData.message && errorData.message.includes('Barcode already exists')) {
            setErrorMessage('This barcode is already in use. Please use a different barcode or leave it empty.');
          } else {
            setErrorMessage(errorData.message || 'Failed to update product');
          }
          return;
        }
      } else {
        // Create new product - ensure shop ID is included
        const createData = {
          ...productData,
          shop: shopId // Re-add shop ID to be sure
        };
        
        const response = await fetch(' https://smartcart-backend-8pu4.onrender.com/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(createData),
        });
        
        if (response.ok) {
          const newProduct = await response.json();
          setProducts([...products, newProduct]);
          setSuccessMessage('Product created successfully!');
        } else {
          const errorData = await response.json();
          if (errorData.message && errorData.message.includes('Barcode already exists')) {
            setErrorMessage('This barcode is already in use. Please use a different barcode or leave it empty.');
          } else if (errorData.message && errorData.message.includes('Validation error')) {
            setErrorMessage('Please check your input fields. All required fields must be filled correctly.');
          } else {
            setErrorMessage(errorData.message || 'Failed to create product');
          }
          return;
        }
      }
      
      // Reset form and close modal after delay to show success message
      setTimeout(() => {
        setFormData({
          name: '',
          category: '',
          price: '',
          stock: '',
          description: '',
          barcode: '',
          image: ''
        });
        setShowAddModal(false);
        setEditingProduct(null);
        setErrorMessage('');
        setSuccessMessage('');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving product:', error);
      setErrorMessage('Error saving product. Please try again.');
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      barcode: product.barcode || '',
      image: product.image || ''
    });
    setShowAddModal(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = getAuthToken();
        if (!token) {
          setErrorMessage('Authentication token not found. Please log in again.');
          return;
        }
        
        const response = await fetch(` https://smartcart-backend-8pu4.onrender.com/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setProducts(products.filter(product => product._id !== productId));
          setSuccessMessage('Product deleted successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setErrorMessage('Error deleting product. Please try again.');
      }
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Refresh products
  const refreshProducts = async () => {
    setIsLoading(true);
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

      const response = await fetch(` https://smartcart-backend-8pu4.onrender.com/api/products?shop=${shopId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        setSuccessMessage('Products refreshed successfully!');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to refresh products');
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
      setErrorMessage('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
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
          Product Management
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={refreshProducts}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
            disabled={isLoading}
          >
            <FiShoppingCart className="mr-2" />
            {isLoading ? 'Refreshing...' : 'Refresh Products'}
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingProduct(null);
              setFormData({
                name: '',
                category: '',
                price: '',
                stock: '',
                description: '',
                barcode: '',
                image: ''
              });
              clearMessages();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Product
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

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, description, or barcode..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg flex items-center border border-blue-200">
            <FiShoppingCart className="text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => {
                setShowAddModal(true);
                clearMessages();
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Product
            </button>
          </div>
        ) : (
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
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          {product.image ? (
                            <img className="h-16 w-16 rounded-md object-cover" src={product.image} alt={product.name} />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                              <FiShoppingCart className="text-gray-400 h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.stock > 20 ? 'bg-green-100 text-green-800' : 
                          product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.barcode || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                        title="Edit product"
                      >
                        <FiEdit2 className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete product"
                      >
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 transition-colors"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    category: '',
                    price: '',
                    stock: '',
                    description: '',
                    barcode: '',
                    image: ''
                  });
                  clearMessages();
                }}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error Message in Modal */}
            {errorMessage && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <div className="flex items-center">
                  <FiAlertCircle className="mr-2" />
                  <span className="block sm:inline">{errorMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="e.g., Electronics, Groceries, Clothing"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    id="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Optional - leave empty if not needed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Note: Barcode must be unique. Leave empty if you don't have a barcode.
                  </p>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Optional product description"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      category: '',
                      price: '',
                      stock: '',
                      description: '',
                      barcode: '',
                      image: ''
                    });
                    clearMessages();
                  }}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
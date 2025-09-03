import React, { useState, useEffect } from "react";
import { Edit, Trash2, UserPlus, Users, AlertTriangle, ChevronRight, ShoppingCart, Copy } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || " https://smartcart-backend-8pu4.onrender.com";

const initialForm = {
  managerName: "",
  email: "",
  password: "",
  shopName: "",
  shopAddress: "",
  phone: "",
  assignedCarts: [],
  shopId: "",
};

// Helper function to generate shop ID
const generateShopId = (shopName, existingManagers) => {
  // Create base ID from shop name
  const baseId = shopName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '') // Remove special characters
    .substring(0, 6); // Take first 6 characters
  
  // Find all existing shop IDs with the same base
  const existingIds = existingManagers
    .map(m => m.shop?.id)
    .filter(id => id && id.startsWith(baseId))
    .map(id => {
      const match = id.match(/\d+$/);
      return match ? parseInt(match[0]) : 0;
    });
  
  // Get the next available number
  const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
  
  return `${baseId}${nextNumber.toString().padStart(3, '0')}`;
};

const CartAssignment = ({ availableCarts, assignedCarts, onAssignCart, onUnassignCart }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned Carts</h3>
        {assignedCarts.length === 0 ? (
          <p className="text-sm text-gray-500">No carts assigned</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignedCarts.map(cart => (
              <div 
                key={cart.cart_id || cart} 
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>Cart #{cart.cart_id || cart}</span>
                <button 
                  onClick={() => onUnassignCart(cart.cart_id || cart)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Assign Available Carts
        </label>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onAssignCart(e.target.value);
              e.target.value = ""; // Reset select
            }
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select cart to assign</option>
          {availableCarts
            .filter(cart => !assignedCarts.some(ac => (ac.cart_id || ac) === cart.cart_id))
            .map(cart => (
              <option key={cart.cart_id} value={cart.cart_id}>
                Cart #{cart.cart_id} ({cart.status})
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

const CustomersPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [managers, setManagers] = useState([]);
  const [availableCarts, setAvailableCarts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatedShopId, setGeneratedShopId] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const safeParse = async (res) => {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      console.warn("Failed to parse JSON:", text);
      return null;
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
    setErrors({});
    setGeneratedShopId("");
  };

  const validate = (isEdit = false) => {
    const errs = {};
    if (!form.managerName.trim()) errs.managerName = "Manager name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!isEdit) {
      if (!form.password) errs.password = "Password is required";
      else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    } else if (form.password && form.password.length < 6) {
      errs.password = "Minimum 6 characters";
    }
    if (!form.shopName.trim()) errs.shopName = "Shop name required";
    if (!form.shopAddress.trim()) errs.shopAddress = "Shop address required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\+?\d{7,15}$/.test(form.phone)) errs.phone = "Invalid phone";
    return errs;
  };

  const fetchManagers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/managers`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });
      const data = await safeParse(res);
      if (!res.ok) throw new Error(data?.message || "Failed to load managers");
      setManagers(
        (data.managers || []).map((m) => ({
          id: m._id,
          managerName: m.managerName,
          email: m.email,
          shop: m.shop || {},
          assignedCarts: m.assignedCarts || [],
          createdAt: m.createdAt,
        }))
      );
    } catch (err) {
      setErrors({ general: err.message || "Failed to load managers" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCarts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/carts?status=Available`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      const data = await res.json();
      setAvailableCarts(data);
    } catch (err) {
      console.error("Failed to fetch carts:", err);
    }
  };

  useEffect(() => {
    fetchManagers();
    fetchAvailableCarts();
  }, []);

  // Generate shop ID when shop name changes
  useEffect(() => {
    if (form.shopName.trim() && !editing) {
      const newShopId = generateShopId(form.shopName, managers);
      setGeneratedShopId(newShopId);
      setForm(prev => ({ ...prev, shopId: newShopId }));
    }
  }, [form.shopName, managers, editing]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    setSuccessMsg("");
  };

  const handleAssignCart = (cartId) => {
    if (!form.assignedCarts.some(cart => (cart.cart_id || cart) === cartId)) {
      setForm(prev => ({
        ...prev,
        assignedCarts: [...prev.assignedCarts, cartId],
      }));
    }
  };

  const handleUnassignCart = (cartId) => {
    setForm(prev => ({
      ...prev,
      assignedCarts: prev.assignedCarts.filter(cart => (cart.cart_id || cart) !== cartId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editing);
    const validation = validate(isEdit);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setSuccessMsg("");

    try {
      const payload = {
        managerName: form.managerName,
        email: form.email,
        shop: {
          name: form.shopName,
          id: form.shopId || generateShopId(form.shopName, managers),
          address: form.shopAddress,
          phone: form.phone,
        },
        assignedCarts: form.assignedCarts,
      };
      
      if (form.password) payload.password = form.password;

      const url = isEdit
        ? `${API_BASE}/api/admin/manager/${editing.id}`
        : `${API_BASE}/api/admin/add-manager`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await safeParse(res);
      if (!res.ok) throw new Error(data?.message || "Failed to save manager");

      // Update cart statuses for assigned carts
      await Promise.all(
        form.assignedCarts.map(cartId =>
          fetch(`${API_BASE}/api/carts/${cartId}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            body: JSON.stringify({ status: "In Use" }),
          })
        )
      );

      const returnedManager = data.manager;
      setManagers((prev) =>
        isEdit
          ? prev.map((m) =>
              m.id === returnedManager._id
                ? { ...m, ...returnedManager, id: returnedManager._id }
                : m
            )
          : [{ ...returnedManager, id: returnedManager._id }, ...prev]
      );

      // Refresh available carts
      await fetchAvailableCarts();

      setSuccessMsg(isEdit ? "Manager updated successfully." : "Manager added.");
      resetForm();
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (manager) => {
    setEditing(manager);
    setForm({
      managerName: manager.managerName || "",
      email: manager.email || "",
      password: "",
      shopName: manager.shop?.name || "",
      shopAddress: manager.shop?.address || "",
      phone: manager.shop?.phone || "",
      assignedCarts: manager.assignedCarts || [],
      shopId: manager.shop?.id || "",
    });
    setErrors({});
    setSuccessMsg("");
    setGeneratedShopId(manager.shop?.id || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/manager/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setManagers((prev) => prev.filter((m) => m.id !== id));
      setSuccessMsg("Manager removed.");
    } catch (err) {
      setErrors({ general: `Delete failed: ${err.message}` });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show a temporary success message
        const originalText = document.getElementById('copy-button').innerText;
        document.getElementById('copy-button').innerText = 'Copied!';
        setTimeout(() => {
          document.getElementById('copy-button').innerText = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Managers...</p>
        </div>
      </div>
    );
  }

  if (errors.general && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Managers</h3>
            <p className="text-red-600">{errors.general}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {editing ? "Edit manager details" : "Add and manage shop managers"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {managers.length} {managers.length === 1 ? "Manager" : "Managers"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-3 rounded-xl shadow-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editing ? "Edit Manager" : "Add New Manager"}
                </h2>
                <p className="text-sm text-gray-500">
                  {editing ? "Update manager details" : "Create a new shop manager account"}
                </p>
              </div>
            </div>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{errors.general}</div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{successMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["managerName", "email", "password", "shopName", "shopAddress", "phone"].map(
              (field) => (
                <div
                  key={field}
                  className={field === "shopAddress" ? "md:col-span-2" : ""}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={field}
                    type={
                      field === "password"
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    value={form[field]}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors[field] ? "border-red-300" : "border-gray-300"
                    } rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                  />
                  {errors[field] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                  )}
                </div>
              )
            )}

            {/* Shop ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop ID
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={editing ? form.shopId : generatedShopId}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Shop ID will be generated automatically"
                />
                <button
                  type="button"
                  id="copy-button"
                  onClick={() => copyToClipboard(editing ? form.shopId : generatedShopId)}
                  className="ml-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Auto-generated unique shop identifier
              </p>
            </div>

            <div className="md:col-span-2">
              <CartAssignment
                availableCarts={availableCarts}
                assignedCarts={form.assignedCarts}
                onAssignCart={handleAssignCart}
                onUnassignCart={handleUnassignCart}
              />
            </div>

            <div className="col-span-2 flex justify-end gap-4 pt-2">
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {submitting
                  ? editing
                    ? "Updating..."
                    : "Adding..."
                  : editing
                  ? "Update Manager"
                  : "Add Manager"}
              </button>
            </div>
          </form>
        </div>

        {/* Managers List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-3 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Managers</h2>
                <p className="text-sm text-gray-500">
                  List of all shop managers in the system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-700">
                    {managers.length} {managers.length === 1 ? "Entry" : "Entries"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {managers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Users className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Managers Found
              </h3>
              <p className="text-gray-600">
                Add your first manager using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {managers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {m.managerName}
                        </p>
                        <p className="text-sm text-gray-500">{m.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {m.shop?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {m.shop?.id}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="truncate">{m.shop?.address}</span>
                      <span className="mx-2">·</span>
                      <span>{m.shop?.phone}</span>
                      {m.assignedCarts?.length > 0 && (
                        <>
                          <span className="mx-2">·</span>
                          <span className="flex items-center">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {m.assignedCarts.length} cart(s)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => startEdit(m)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
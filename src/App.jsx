import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AdminLogin from "./components/AdminDashboard/AdminLogin";
import AdminDashboardPage from "./components/AdminDashboard/AdminDashboard";
import ManagerDashboardPage from "./components/ManagerDashboard/ManagerDashboard"; 
import DashboardPage from "./components/AdminDashboard/pages/DashboardPage";
import CartsPage from "./components/AdminDashboard/pages/CartPage";
import CustomersPage from "./components/AdminDashboard/pages/CustomersPage";
import OrdersPage from "./components/AdminDashboard/pages/OrdersPage";
import AnalyticsPage from "./components/AdminDashboard/pages/AnalyticsPage";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import ManagerLogin from "./components/ManagerDashboard/ManagerLogin";
import Overview from "./components/ManagerDashboard/pages/Dashboard";
import ProductManagement from "./components/ManagerDashboard/pages/ProductManagement";
import ProtectedRoute from "./components/ManagerDashboard/ProtectedRoute";
import User from "./components/UserDashboard/UserDashboard";
import ProtectedRouteAdmin from "./components/AdminDashboard/ProtectedRouteAdmin";
import SalesAnalytics from "./components/ManagerDashboard/pages/SalesAnalytics";

const App = () => {
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  const handleRoleSelection = (role) => {
    setUserRole(role);
    if (role === "admin") setUserName("Admin User");
    else if (role === "manager") setUserName("Sarah Manager");
    else setUserName("Mike Staff");
  };

  return (
    <Router>
      <Routes>
        {/* Login Routes */}
        <Route path="/" element={<LoginScreen handleRoleSelection={handleRoleSelection} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/user" element={<User />} />

        {/* User Dashboard */}
        <Route path="/user/dashboard" element={<UserDashboard />} />

        {/* Manager Dashboard (Protected) */}
        <Route 
          path="/manager/*" 
          element={
            <ProtectedRoute>
              <ManagerDashboardPage userName={userName} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="sales" element={<SalesAnalytics />} />
        </Route>

        {/* Admin Dashboard (Protected) */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRouteAdmin>
              <AdminDashboardPage />
            </ProtectedRouteAdmin>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="carts" element={<CartsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

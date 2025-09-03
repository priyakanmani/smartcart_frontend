// src/components/LoginScreen.jsx
import { ShoppingCart, Crown, Users, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const roleData = [
  {
    id: 'admin',
    title: 'Admin',
    icon: Crown,
    color: 'bg-gradient-to-br from-red-500 to-pink-500',
    hoverColor: 'hover:from-red-600 hover:to-pink-600',
    description: 'Full system access and configuration',
    route: '/admin/login'
  },
  {
    id: 'manager',
    title: 'Manager',
    icon: Users,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
    description: 'Inventory and staff management',
    route: '/manager/login'
  },
  {
    id: 'user',
    title: 'Customer',
    icon: User,
    color: 'bg-gradient-to-br from-purple-500 to-indigo-500',
    hoverColor: 'hover:from-purple-600 hover:to-indigo-600',
    description: 'Browse products and make purchases',
    route: '/user/dashboard'
  }
];

const LoginScreen = ({ handleRoleSelection }) => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleClick = (role) => {
    handleRoleSelection(role);
    const selectedRole = roleData.find(r => r.id === role);
    if (selectedRole) {
      navigate(selectedRole.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl" // Increased max width
      >
        {/* Branding Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div 
            whileHover={{ rotate: -5 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg"
          >
            <ShoppingCart className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Smart <span className="text-blue-600">Shopping</span> Cart
          </h1>
          <p className="text-gray-500">
            Intelligent retail solution for seamless shopping experiences
          </p>
        </div>

        {/* Role Selection Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Select Your Role</h2>
          <p className="text-gray-500 text-center mb-6">Choose your access level to continue</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center"> {/* Changed to flex row on medium screens */}
          {roleData.map((role) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.id}
                onClick={() => handleClick(role.id)}
                onHoverStart={() => setHoveredRole(role)}
                onHoverEnd={() => setHoveredRole(null)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`${role.color} ${role.hoverColor} text-white font-medium p-5 rounded-xl w-full md:w-auto flex-1 transition-all duration-300 flex flex-col items-center justify-between shadow-md hover:shadow-lg min-h-[180px]`} // Adjusted styling
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 rounded-full p-3 mb-4"> {/* Increased padding */}
                    <Icon className="w-6 h-6" /> {/* Increased icon size */}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
                    <p className="text-sm text-white/80">{role.description}</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center text-sm font-medium mt-4"
                >
                  Select <ChevronRight className="w-4 h-4 ml-1" />
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
        </div>

        {/* Desktop hover description */}
        <AnimatePresence>
          {hoveredRole && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="hidden lg:block mt-4 bg-indigo-50 rounded-lg p-4"
            >
              <h3 className="font-semibold text-indigo-700">{hoveredRole.title} Access</h3>
              <p className="text-sm text-gray-600">{hoveredRole.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
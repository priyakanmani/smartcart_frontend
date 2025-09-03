// src/components/ProtectedRouteAdmin.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, ArrowRight, Clock, AlertCircle } from "lucide-react";

const ProtectedRouteAdmin = ({ children }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const token = localStorage.getItem("adminToken"); // ✅ Admin token

  useEffect(() => {
    if (!token) {
      setShowMessage(true);

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setRedirect(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [token]);

  if (redirect) {
    return <Navigate to="/" replace />; // ✅ Redirect to admin login
  }

  if (!token) {
    return (
      <AnimatePresence>
        {showMessage && (
          <div className="fixed inset-0 bg-gradient-to-br from-rose-400/80 via-pink-300/80 to-red-300/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 mx-4 border border-white/20"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 100,
                    delay: 0.2,
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 p-5 rounded-2xl shadow-lg">
                    <Lock className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-rose-600 to-pink-700 bg-clip-text text-transparent">
                    Admin Access Only
                  </h3>

                  <p className="text-gray-600 text-lg leading-relaxed">
                    This area requires admin authentication. Please log in to continue.
                  </p>
                </div>

                {/* Countdown & Progress */}
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-center text-sm text-rose-600 font-medium">
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    <span>Redirecting in {countdown} seconds</span>
                  </div>

                  <div className="w-full bg-rose-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-rose-500 to-pink-600 h-2 rounded-full"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRedirect(true)}
                  className="group w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span>Go to Admin Login</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Help Text */}
                <p className="text-sm text-rose-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Contact super admin if you need access
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return children;
};

export default ProtectedRouteAdmin;

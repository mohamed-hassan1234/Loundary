import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";

// API configuration - easy to change for different environments
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL= "https://sidra.somsoftsystems.com/api";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setMessage("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        formData,
        { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        }
      );

      setMessage(res.data.message);

      // Save user info securely
      const userData = {
        id: res.data.user.id,
        username: res.data.user.username,
        role: res.data.user.role,
        token: res.data.token // if your API returns a token
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role);
      
      // Store token if exists
      if (res.data.token) {
        localStorage.setItem("auth_token", res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }

      // Redirect based on role with slight delay for better UX
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin");
        } else if (userData.role === "cashier") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 500);

      setFormData({ username: "", password: "" });
    } catch (err) {
      // Enhanced error handling
      if (err.response) {
        setMessage(err.response.data?.error || "Login failed. Please check credentials.");
      } else if (err.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Decorative background elements - Light version */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-[#05E2F2]/5 to-[#05E2F2]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-[#05E2F2]/5 to-[#0099FF]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-[#05E2F2]/3 to-[#05E2F2]/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-[#0099FF]/3 to-[#05E2F2]/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Floating card effect */}
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
          
          {/* Logo Section - Positioned at the top */}
          <div className="text-center pt-8">
            <div className="inline-flex items-center justify-center mb-4">
              {/* Logo Container - You can replace this with your actual logo */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#05E2F2] to-[#0099FF] rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-white font-bold text-2xl">L</div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
              </div>
              <div className="ml-4 text-left">
                <h1 className="text-2xl font-bold text-gray-800">Login</h1>
                <p className="text-sm text-gray-600">Access your account</p>
              </div>
            </div>
          </div>

          {/* Accent header */}
          <div className="bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/90 p-6 text-center mt-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-sm">
                <FiLogIn className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            </div>
            <p className="text-white/90 font-medium mt-2">Sign in to continue</p>
          </div>

          {/* Form container */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="group">
                <div className="flex items-center mb-2">
                  <FiUser className="text-[#05E2F2] mr-2" />
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#05E2F2] focus:ring-2 focus:ring-[#05E2F2]/20 transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                    required
                    disabled={isLoading}
                    autoComplete="username"
                  />
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2] transition-colors" />
                </div>
              </div>

              {/* Password field */}
              <div className="group">
                <div className="flex items-center mb-2">
                  <FiLock className="text-[#05E2F2] mr-2" />
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#05E2F2] focus:ring-2 focus:ring-[#05E2F2]/20 transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2] transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#05E2F2] transition-colors p-1"
                    disabled={isLoading}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-[#05E2F2] hover:text-[#0099FF] font-medium transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#05E2F2] to-[#0099FF] text-white font-bold py-4 px-6 rounded-2xl hover:shadow-lg hover:shadow-[#05E2F2]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="text-lg" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Message display */}
              {message && (
                <div className={`p-4 rounded-2xl text-center font-medium transition-all duration-300 animate-fadeIn ${
                  message.toLowerCase().includes("logged in") || 
                  message.toLowerCase().includes("success")
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {message.toLowerCase().includes("logged in") || 
                     message.toLowerCase().includes("success") ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{message}</span>
                  </div>
                </div>
              )}

              {/* Role hint */}
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-100">
                    <span className="font-semibold text-[#05E2F2] block">Admin</span>
                    <span className="text-xs text-gray-600">/admin panel</span>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-100">
                    <span className="font-semibold text-[#05E2F2] block">Cashier</span>
                    <span className="text-xs text-gray-600">/dashboard</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-8 p-4 bg-gradient-to-r from-[#05E2F2]/5 to-[#05E2F2]/10 rounded-2xl border border-[#05E2F2]/20">
              <p className="text-sm text-center text-gray-600">
                <span className="font-bold text-[#05E2F2]">Note:</span> Use your registered credentials to access the system
              </p>
            </div>

            {/* Alternative login or register link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-[#05E2F2] hover:text-[#0099FF] font-semibold transition-colors"
                  onClick={() => navigate("/reg")}
                >
                  Register here
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-center text-sm text-gray-500">
                Secure • Encrypted • Protected
              </p>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
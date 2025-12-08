import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiKey, FiMail, FiUserPlus, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";

// API Configuration
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL= "https://sidra.somsoftsystems.com/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    secretKey: "",
    email: ""
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Check password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
    
    // Clear message when user starts typing
    if (message) setMessage("");
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return "Strong";
    if (passwordStrength >= 50) return "Medium";
    if (passwordStrength >= 25) return "Weak";
    return "Very Weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim() || !formData.password.trim() || 
        !formData.name.trim() || !formData.secretKey.trim()) {
      setMessage("Please fill in all required fields");
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/register-admin`, 
        formData, 
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      setMessage(res.data.message || "Admin account created successfully!");
      
      // Store admin data
      if (res.data.user) {
        const userData = {
          id: res.data.user.id,
          username: res.data.user.username,
          name: res.data.user.name,
          role: res.data.user.role,
          email: res.data.user.email
        };
        localStorage.setItem("admin_registered", JSON.stringify(userData));
      }
      
      // Clear form
      setFormData({ 
        username: "", 
        password: "", 
        name: "", 
        secretKey: "",
        email: "" 
      });
      setPasswordStrength(0);
      
      // Redirect to login page after success
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data?.error || "Registration failed. Please try again.");
      } else if (err.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#05E2F2]/20 to-cyan-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-[#05E2F2]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-[#05E2F2]/10 to-cyan-400/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Main Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Logo and Header Section */}
          <div className="bg-gradient-to-r from-[#05E2F2] via-cyan-400 to-blue-400 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo Section - Replace with your actual logo */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-2xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-[#05E2F2] to-blue-500 rounded-xl flex items-center justify-center shadow-inner">
                    <FiUserPlus className="text-3xl text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Admin Registration</h1>
                  <p className="text-cyan-100 font-medium">System Administrator Portal</p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/30 rounded-lg">
                    <FiKey className="text-xl text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Secure Registration</p>
                    <p className="text-cyan-100 text-sm">Encrypted & Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Panel - Information */}
            <div className="lg:col-span-1 bg-gradient-to-b from-gray-50 to-cyan-50 p-8">
              <div className="sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Account Features</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-3 bg-[#05E2F2]/10 rounded-xl">
                      <FiUser className="text-[#05E2F2] text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Full System Access</h3>
                      <p className="text-gray-600 text-sm mt-1">Complete control over all system modules and settings</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <FiKey className="text-green-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">User Management</h3>
                      <p className="text-gray-600 text-sm mt-1">Create, edit, and manage all user accounts</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <FiCheck className="text-purple-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Security Controls</h3>
                      <p className="text-gray-600 text-sm mt-1">Advanced security settings and audit logs</p>
                    </div>
                  </div>

                  <div className="mt-8 p-5 bg-gradient-to-r from-[#05E2F2]/10 to-blue-400/10 rounded-2xl border border-[#05E2F2]/20">
                    <h3 className="font-bold text-gray-800 mb-2">Requirements:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#05E2F2] rounded-full"></div>
                        <span>Valid Admin Secret Key</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#05E2F2] rounded-full"></div>
                        <span>Strong Password (6+ characters)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#05E2F2] rounded-full"></div>
                        <span>Unique Username</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="lg:col-span-2 p-8">
              <div className="max-w-2xl mx-auto">
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Create Admin Account</h2>
                  <p className="text-gray-600 mt-2">Fill in the details below to register as system administrator</p>
                  
                  {/* Progress Indicator */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Password Strength: {getPasswordStrengthText()}</span>
                        <span>{passwordStrength}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2] transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-4 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Email Field (Optional) */}
                  <div className="group">
                    {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-gray-400 text-xs">(Optional)</span>
                    </label> */}
                    {/* <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2] transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="admin@company.com"
                        className="w-full px-4 py-4 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                        disabled={isSubmitting}
                      />
                    </div> */}
                  </div>

                  {/* Username Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2] transition-colors" />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-4 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2] transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-4 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                        required
                        minLength="6"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#05E2F2] transition-colors p-1"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {["Very Weak", "Weak", "Medium", "Strong"].map((text, index) => (
                        <div key={index} className="text-center">
                          <div className={`h-1 rounded-full ${passwordStrength >= (index + 1) * 25 ? getPasswordStrengthColor() : 'bg-gray-200'}`}></div>
                          <span className="text-xs text-gray-500 mt-1">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Secret Key Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin Secret Key *
                    </label>
                    <div className="relative">
                      <FiKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2] transition-colors" />
                      <input
                        type={showSecretKey ? "text" : "password"}
                        name="secretKey"
                        value={formData.secretKey}
                        onChange={handleChange}
                        placeholder="Enter admin secret key"
                        className="w-full px-4 py-4 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#05E2F2] transition-colors p-1"
                        disabled={isSubmitting}
                      >
                        {showSecretKey ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Required to verify admin registration privileges</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#05E2F2] to-blue-500 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-lg hover:shadow-[#05E2F2]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Admin Account...</span>
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="text-lg" />
                        <span>Create Admin Account</span>
                      </>
                    )}
                  </button>

                  {/* Message Display */}
                  {message && (
                    <div className={`p-4 rounded-2xl text-center font-medium transition-all duration-300 ${
                      message.toLowerCase().includes("success") 
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        {message.toLowerCase().includes("success") ? (
                          <FiCheck className="text-green-600" />
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>{message}</span>
                      </div>
                      {message.toLowerCase().includes("success") && (
                        <p className="text-sm text-green-600 mt-2">Redirecting to login page...</p>
                      )}
                    </div>
                  )}

                  {/* Login Link */}
                  <div className="text-center pt-6 border-t border-gray-100">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link to="/" className="font-semibold text-[#05E2F2] hover:text-blue-500 transition-colors">
                        Sign In Here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600">
                  Secure Admin Registration • Encrypted Data Transmission
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">API: {API_BASE_URL}</span>
                </div>
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
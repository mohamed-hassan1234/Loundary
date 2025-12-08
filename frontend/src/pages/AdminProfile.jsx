import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaKey, 
  FaIdBadge, 
  FaSave, 
  FaTrash, 
  FaSignOutAlt, 
  FaEye, 
  FaEyeSlash,
  FaUserCircle,
  FaShieldAlt,
  FaEnvelope,
  FaCalendar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCrown,
  FaUsers,
  FaLock,
  FaDatabase
} from "react-icons/fa";

// API base URL variable
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL= "https://sidra.somsoftsystems.com/api";
const AdminProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    role: "",
    createdAt: "",
    _id: ""
  });
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    secretKey: ""
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [stats, setStats] = useState({
    totalCashiers: 0,
    totalAdmins: 0,
    recentActivity: []
  });

  useEffect(() => {
    fetchAdminProfile();
    fetchAdminStats();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      
      // Don't use token in header when using cookies
      const res = await axios.get(`${API_BASE_URL}/auth/admin/profile`, {
        withCredentials: true
      });

      // Response comes directly as user object, not wrapped in success/data
      if (res.data) {
        setProfile(res.data);
        setFormData({
          username: res.data.username,
          name: res.data.name,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          secretKey: ""
        });
        
        // Store admin data in localStorage
        localStorage.setItem("admin", JSON.stringify({
          id: res.data._id,
          username: res.data.username,
          name: res.data.name,
          role: res.data.role
        }));
      }
    } catch (error) {
      console.error("Admin profile fetch error:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAdminData();
        setMessage({
          type: "error",
          text: "Admin access required. Redirecting to login..."
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage({
          type: "error",
          text: error.response?.data?.error || "Failed to load admin profile"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/cashiers`, {
        withCredentials: true
      });

      // Response comes directly as array of cashiers
      if (Array.isArray(res.data)) {
        setStats(prev => ({
          ...prev,
          totalCashiers: res.data.length || 0
        }));
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const clearAdminData = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    // Validate passwords match if changing password
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match"
      });
      setUpdating(false);
      return;
    }

    try {
      const updateData = {
        username: formData.username,
        name: formData.name,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
        ...(formData.secretKey && {
          secretKey: formData.secretKey
        })
      };

      const res = await axios.put(`${API_BASE_URL}/auth/admin/profile`, updateData, {
        withCredentials: true
      });

      // Response format: { message: "...", user: {...} }
      if (res.data && res.data.user) {
        setProfile(res.data.user);
        setFormData({
          username: res.data.user.username,
          name: res.data.user.name,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          secretKey: ""
        });
        
        // Update localStorage
        localStorage.setItem("admin", JSON.stringify({
          id: res.data.user._id,
          username: res.data.user.username,
          name: res.data.user.name,
          role: res.data.user.role
        }));
        
        setMessage({
          type: "success",
          text: res.data.message || "Admin profile updated successfully!"
        });
        
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update admin profile"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage({
        type: "error",
        text: "Please enter your password to delete account"
      });
      return;
    }

    if (!window.confirm("⚠️ CRITICAL WARNING: This will permanently delete your admin account and all associated data. This action cannot be undone! Are you absolutely sure?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_BASE_URL}/auth/profile`, {
        data: { password: deletePassword },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        clearAdminData();
        setMessage({
          type: "success",
          text: "Admin account deleted successfully. Redirecting to login..."
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to delete admin account"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true
      });
      
      // Clear all admin data from localStorage
      clearAdminData();
      
      // Redirect to login
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear localStorage and redirect even if API call fails
      clearAdminData();
      navigate("/");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/10 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#05E2F2]/20"></div>
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-[#05E2F2] border-t-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FaCrown className="text-[#05E2F2] text-3xl" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading Admin Profile...</p>
          <p className="text-sm text-gray-400 mt-2">Loading system administrator settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/10 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header with Crown */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 rounded-3xl shadow-2xl shadow-[#05E2F2]/20 mb-6">
            <FaCrown className="text-white text-5xl" />
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <FaCrown className="text-white text-sm" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
            System Administrator
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Full system control and administrator account management
          </p>
        </div>

        {/* Admin Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#05E2F2]/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">{stats.totalCashiers}</div>
                <div className="text-gray-500">Total Cashiers</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 rounded-xl flex items-center justify-center">
                <FaUsers className="text-[#05E2F2] text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#05E2F2]/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">1</div>
                <div className="text-gray-500">Active Admins</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 rounded-xl flex items-center justify-center">
                <FaLock className="text-[#05E2F2] text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#05E2F2]/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">{formatDate(profile.createdAt).split(' at ')[0]}</div>
                <div className="text-gray-500">Admin Since</div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 rounded-xl flex items-center justify-center">
                <FaCalendar className="text-[#05E2F2] text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Message Notification */}
        {message.text && (
          <div className={`max-w-4xl mx-auto mb-8 p-5 rounded-2xl shadow-lg border-l-4 ${
            message.type === "success" 
              ? "bg-gradient-to-r from-green-50 to-white border-green-400" 
              : "bg-gradient-to-r from-red-50 to-white border-red-400"
          } transform transition-all duration-300 animate-slide-down`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                message.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}>
                {message.type === "success" ? (
                  <FaCheckCircle className="text-green-500 text-2xl" />
                ) : (
                  <FaExclamationTriangle className="text-red-500 text-2xl" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  message.type === "success" ? "text-green-700" : "text-red-700"
                }`}>
                  {message.text}
                </p>
              </div>
              <button
                onClick={() => setMessage({ type: "", text: "" })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Admin Profile Sidebar - Premium Design */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-7 border border-white/40 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#05E2F2]/20 to-[#05E2F2]/5 rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 rounded-full"></div>
              
              <div className="relative z-10">
                {/* Admin Avatar Section */}
                <div className="flex flex-col items-center mb-10">
                  <div className="relative mb-6">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/70 flex items-center justify-center shadow-2xl shadow-[#05E2F2]/30">
                      <span className="text-white text-5xl font-bold">
                        {getInitials(profile.name)}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                        <FaCrown className="text-white text-lg" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
                    <p className="text-[#05E2F2] font-semibold mb-3">@{profile.username}</p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 text-yellow-600 font-semibold rounded-full border border-yellow-400/20">
                      <FaCrown className="text-sm" />
                      System Administrator
                    </span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="space-y-3 mb-10">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                      activeTab === "profile" 
                        ? "bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white shadow-lg shadow-[#05E2F2]/30 transform -translate-y-1" 
                        : "text-gray-700 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeTab === "profile" ? "bg-white/20" : "bg-[#05E2F2]/10"
                    }`}>
                      <FaUser className={activeTab === "profile" ? "text-white" : "text-[#05E2F2]"} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">Admin Profile</div>
                      <div className={`text-sm ${activeTab === "profile" ? "text-white/80" : "text-gray-500"}`}>
                        Account information
                      </div>
                    </div>
                    {activeTab === "profile" && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                      activeTab === "security" 
                        ? "bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white shadow-lg shadow-[#05E2F2]/30 transform -translate-y-1" 
                        : "text-gray-700 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeTab === "security" ? "bg-white/20" : "bg-[#05E2F2]/10"
                    }`}>
                      <FaLock className={activeTab === "security" ? "text-white" : "text-[#05E2F2]"} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">Security</div>
                      <div className={`text-sm ${activeTab === "security" ? "text-white/80" : "text-gray-500"}`}>
                        Password & Keys
                      </div>
                    </div>
                    {activeTab === "security" && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("danger")}
                    className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                      activeTab === "danger" 
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transform -translate-y-1" 
                        : "text-gray-700 hover:bg-red-50 hover:shadow-lg hover:shadow-red-200/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeTab === "danger" ? "bg-white/20" : "bg-red-100"
                    }`}>
                      <FaTrash className={activeTab === "danger" ? "text-white" : "text-red-500"} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">Danger Zone</div>
                      <div className={`text-sm ${activeTab === "danger" ? "text-white/80" : "text-red-400"}`}>
                        Delete account
                      </div>
                    </div>
                    {activeTab === "danger" && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    )}
                  </button>
                </div>

                {/* Admin Logout Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-2xl"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="font-semibold">Logout Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/40">
              {/* Admin Profile Tab */}
              {activeTab === "profile" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                      <FaUserCircle className="text-[#05E2F2] text-3xl" />
                      Administrator Profile
                    </h2>
                    <div className="text-sm text-gray-500 bg-[#05E2F2]/5 px-4 py-2 rounded-full">
                      <FaCalendar className="inline mr-2" />
                      Admin since: {formatDate(profile.createdAt)}
                    </div>
                  </div>

                  {/* Admin Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="p-6 rounded-2xl border border-[#05E2F2]/20 bg-gradient-to-br from-white to-[#05E2F2]/5 shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 flex items-center justify-center">
                          <FaIdBadge className="text-[#05E2F2] text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-700">Full Name</h3>
                          <p className="text-gray-900 text-xl font-bold">{profile.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-[#05E2F2]/20 bg-gradient-to-br from-white to-[#05E2F2]/5 shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 flex items-center justify-center">
                          <FaEnvelope className="text-[#05E2F2] text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-700">Username</h3>
                          <p className="text-gray-900 text-xl font-bold">{profile.username}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-[#05E2F2]/20 bg-gradient-to-br from-white to-[#05E2F2]/5 shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 flex items-center justify-center">
                          <FaCrown className="text-[#05E2F2] text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-700">Account Role</h3>
                          <p className="text-gray-900 text-xl font-bold">System Administrator</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-[#05E2F2]/20 bg-gradient-to-br from-white to-[#05E2F2]/5 shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 flex items-center justify-center">
                          <FaShieldAlt className="text-[#05E2F2] text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-700">Access Level</h3>
                          <p className="text-gray-900 text-xl font-bold">Full System Control</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Form */}
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Full Name
                        </label>
                        <div className="relative">
                          <FaIdBadge className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-[#05E2F2] transition-all bg-white/50 backdrop-blur-sm"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Username
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-[#05E2F2] transition-all bg-white/50 backdrop-blur-sm"
                            placeholder="Enter your username"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={updating}
                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white font-bold rounded-2xl hover:from-[#05E2F2]/90 hover:to-[#05E2F2] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                      >
                        <FaSave className="text-lg" />
                        {updating ? "Updating Admin Profile..." : "Update Admin Profile"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <FaLock className="text-[#05E2F2] text-3xl" />
                    Security Settings
                  </h2>

                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-3xl">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Current Password
                      </label>
                      <div className="relative">
                        <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-[#05E2F2] transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#05E2F2] transition-colors"
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* New Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          New Password
                        </label>
                        <div className="relative">
                          <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-[#05E2F2] transition-all bg-white/50 backdrop-blur-sm"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#05E2F2] transition-colors"
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-[#05E2F2] transition-all bg-white/50 backdrop-blur-sm"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#05E2F2] transition-colors"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Admin Secret Key */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Admin Secret Key (Optional for verification)
                      </label>
                      <div className="relative">
                        <FaDatabase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showSecretKey ? "text" : "password"}
                          value={formData.secretKey}
                          onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                          className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-[#05E2F2] transition-all bg-white/50 backdrop-blur-sm"
                          placeholder="Enter admin secret key (optional)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#05E2F2] transition-colors"
                        >
                          {showSecretKey ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Enter the admin secret key only if you need to verify admin privileges
                      </p>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={updating}
                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white font-bold rounded-2xl hover:from-[#05E2F2]/90 hover:to-[#05E2F2] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                      >
                        <FaLock className="text-lg" />
                        {updating ? "Updating Security Settings..." : "Update Security Settings"}
                      </button>
                      <p className="text-sm text-gray-500 mt-3">
                        Leave fields empty if you don't want to make changes
                      </p>
                    </div>
                  </form>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <FaTrash className="text-red-500 text-3xl" />
                    Critical Danger Zone
                  </h2>

                  {/* Delete Account Warning */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-3xl p-8 mb-8 shadow-xl">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-red-400/10 flex items-center justify-center flex-shrink-0">
                        <FaTrash className="text-red-500 text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-red-700 mb-4">Delete Admin Account</h3>
                        <div className="space-y-4 mb-6">
                          <p className="text-red-600 font-medium">
                            ⚠️ WARNING: This action is irreversible and will permanently delete your administrator account.
                          </p>
                          <ul className="space-y-2 text-red-600">
                            <li className="flex items-start gap-2">
                              <FaExclamationTriangle className="text-red-500 mt-1" />
                              <span>All admin privileges will be revoked immediately</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FaExclamationTriangle className="text-red-500 mt-1" />
                              <span>All your data will be permanently deleted</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FaExclamationTriangle className="text-red-500 mt-1" />
                              <span>This cannot be undone or recovered</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-semibold text-red-700 mb-3">
                            Enter your password to confirm deletion
                          </label>
                          <div className="relative max-w-md">
                            <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400" />
                            <input
                              type={showDeletePassword ? "text" : "password"}
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              className="w-full pl-12 pr-12 py-4 border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all bg-white"
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowDeletePassword(!showDeletePassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 transition-colors"
                            >
                              {showDeletePassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleDeleteAccount}
                          disabled={!deletePassword}
                          className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                          <FaTrash />
                          Delete My Admin Account
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Logout Section */}
                  <div className="bg-gradient-to-br from-[#05E2F2]/5 to-[#05E2F2]/10 border-2 border-[#05E2F2]/20 rounded-3xl p-8 shadow-lg">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#05E2F2]/20 to-[#05E2F2]/10 flex items-center justify-center flex-shrink-0">
                        <FaSignOutAlt className="text-[#05E2F2] text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Logout Session</h3>
                        <p className="text-gray-600 mb-6">
                          Safely sign out from your current administrator session. You can log back in anytime with your credentials.
                        </p>
                        <button
                          onClick={handleLogout}
                          className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-2xl hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                        >
                          <FaSignOutAlt />
                          Logout Administrator
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Admin Info */}
        <div className="mt-10 p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#05E2F2]/20 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Admin ID</div>
              <div className="font-mono text-[#05E2F2] font-bold">{profile._id?.substring(0, 12)}...</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Account Status</div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-green-400/5 text-green-600 font-semibold rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Active
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Last Active</div>
              <div className="font-medium text-gray-800">{new Date().toLocaleTimeString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">Session</div>
              <div className="font-medium text-gray-800">Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
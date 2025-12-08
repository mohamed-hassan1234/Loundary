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
  FaHistory,
  FaLock,
  FaCog
} from "react-icons/fa";

// API Configuration
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL= "https://sidra.somsoftsystems.com/api";

const ProfileCashier = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    createdAt: "",
    lastLogin: "",
    email: ""
  });
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
    fetchActivityLog();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
        withCredentials: true,
        timeout: 10000
      });
      
      const userData = res.data;
      setProfile({
        username: userData.username || "",
        name: userData.name || "",
        createdAt: userData.createdAt || "",
        lastLogin: userData.lastLogin || new Date().toISOString(),
        email: userData.email || ""
      });
      
      setFormData({
        username: userData.username || "",
        name: userData.name || "",
        email: userData.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage(error.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLog = async () => {
    try {
      // Mock activity data - replace with real API call
      const mockActivities = [
        { id: 1, action: "Logged in", timestamp: new Date(Date.now() - 3600000), ip: "192.168.1.100" },
        { id: 2, action: "Password changed", timestamp: new Date(Date.now() - 86400000), ip: "192.168.1.100" },
        { id: 3, action: "Profile updated", timestamp: new Date(Date.now() - 172800000), ip: "192.168.1.100" },
        { id: 4, action: "Session started", timestamp: new Date(Date.now() - 259200000), ip: "192.168.1.100" },
      ];
      setActivityLog(mockActivities);
    } catch (error) {
      console.error("Error fetching activity log:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setMessage("Current password is required to change password");
      setLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      };

      const res = await axios.put(`${API_BASE_URL}/auth/profile`, updateData, {
        withCredentials: true,
        timeout: 10000
      });

      setProfile(prev => ({
        ...prev,
        username: res.data.user?.username || prev.username,
        name: res.data.user?.name || prev.name,
        email: res.data.user?.email || prev.email
      }));
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      setMessage("✅ Profile updated successfully!");
      
      // Refresh activity log
      fetchActivityLog();
      
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      if (error.response) {
        setMessage(`❌ ${error.response.data?.error || "Failed to update profile"}`);
      } else if (error.request) {
        setMessage("❌ Network error. Please check your connection.");
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage("⚠️ Please enter your password to delete account");
      return;
    }

    if (!window.confirm("⚠️ Are you absolutely sure you want to delete your account?\n\nThis action is PERMANENT and cannot be undone. All your data will be permanently deleted.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/auth/profile`, {
        data: { password: deletePassword },
        withCredentials: true,
        timeout: 10000
      });

      setMessage("✅ Account deleted successfully. Redirecting...");
      
      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("auth_token");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMessage(`❌ ${error.response.data?.error || "Failed to delete account"}`);
      } else if (error.request) {
        setMessage("❌ Network error. Please check your connection.");
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        withCredentials: true,
        timeout: 5000
      });
      
      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("auth_token");
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      localStorage.clear();
      navigate("/");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50 p-4 md:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#05E2F2]/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-[#05E2F2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Account Settings
              </h1>
              <p className="text-gray-600">
                Manage your profile, security, and account preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-[#05E2F2] to-blue-500 text-white rounded-xl font-medium shadow-md">
                Cashier Account
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaCalendar />
                <span>Last login: {formatTimeAgo(profile.lastLogin)}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#05E2F2]/10 rounded-lg">
                  <FaUser className="text-[#05E2F2]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Account Status</div>
                  <div className="font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Active
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FaLock className="text-green-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Security Level</div>
                  <div className="font-bold text-gray-800">High</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FaHistory className="text-purple-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Activities</div>
                  <div className="font-bold text-gray-800">{activityLog.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FaCog className="text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="font-bold text-gray-800">{formatDate(profile.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Profile Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#05E2F2] via-blue-400 to-purple-500 p-1 mb-4 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <FaUserCircle className="text-6xl text-[#05E2F2]" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <FaShieldAlt className="text-white text-sm" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 text-center">{profile.name}</h2>
                  <p className="text-[#05E2F2] font-medium">@{profile.username}</p>
                  <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: "profile", label: "Profile", icon: FaUser, color: "text-[#05E2F2]" },
                    { id: "security", label: "Security", icon: FaShieldAlt, color: "text-green-500" },
                    { id: "activity", label: "Activity", icon: FaHistory, color: "text-purple-500" },
                    { id: "danger", label: "Danger Zone", icon: FaTrash, color: "text-red-500" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                        activeTab === item.id 
                          ? `bg-gradient-to-r ${item.id === 'danger' ? 'from-red-500 to-red-600' : 'from-[#05E2F2] to-blue-500'} text-white shadow-lg` 
                          : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                      }`}
                    >
                      <item.icon className={`text-lg ${activeTab === item.id ? 'text-white' : item.color}`} />
                      <span className="font-medium">{item.label}</span>
                      {activeTab === item.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaSignOutAlt />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* API Status */}
              <div className="bg-gradient-to-r from-[#05E2F2]/10 to-blue-400/10 backdrop-blur-sm rounded-2xl p-4 border border-[#05E2F2]/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">API Connection</span>
                </div>
                <p className="text-xs text-gray-500 truncate" title={API_BASE_URL}>
                  {API_BASE_URL}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30 h-full">
              {/* Message Display */}
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm animate-fadeIn ${
                  message.includes("✅") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : message.includes("⚠️")
                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {message.includes("✅") && <FaSave className="text-green-600" />}
                    {message.includes("⚠️") && <FaShieldAlt className="text-yellow-600" />}
                    {message.includes("❌") && <FaTrash className="text-red-600" />}
                    <span>{message.replace(/[✅⚠️❌]/g, '')}</span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && activeTab !== "danger" && (
                <div className="mb-6 flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#05E2F2]"></div>
                  <span className="ml-3 text-gray-600">Loading...</span>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="p-2 bg-[#05E2F2]/10 rounded-lg">
                        <FaUser className="text-[#05E2F2] text-xl" />
                      </div>
                      <span>Profile Information</span>
                    </h2>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <FaIdBadge className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2]" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all placeholder-gray-400"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Username *
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2]" />
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full px-4 py-3 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all placeholder-gray-400"
                            placeholder="username"
                            required
                          />
                        </div>
                      </div>

                      <div className="group">
                        {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label> */}
                        {/* <div className="relative">
                          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2]" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-3 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all placeholder-gray-400"
                            placeholder="email@example.com"
                          />
                        </div> */}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-[#05E2F2] to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-[#05E2F2]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        <FaSave />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <FaShieldAlt className="text-green-500 text-xl" />
                    </div>
                    <span>Security Settings</span>
                  </h2>

                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                    <div className="space-y-4">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password *
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2]" />
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all placeholder-gray-400"
                            placeholder="••••••••"
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2]" />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={formData.newPassword}
                              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                              className="w-full px-4 py-3 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all placeholder-gray-400"
                              placeholder="••••••••"
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

                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#05E2F2]" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                              className="w-full px-4 py-3 pl-12 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#05E2F2] focus:bg-white transition-all placeholder-gray-400"
                              placeholder="••••••••"
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
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        <FaLock />
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                      <p className="text-sm text-gray-500 mt-3">
                        Note: Leave password fields empty if you don't want to change your password
                      </p>
                    </div>
                  </form>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <FaHistory className="text-purple-500 text-xl" />
                    </div>
                    <span>Recent Activity</span>
                  </h2>

                  <div className="space-y-4">
                    {activityLog.length > 0 ? (
                      activityLog.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm transition-all">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#05E2F2]/10 rounded-lg">
                              <FaShieldAlt className="text-[#05E2F2]" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{activity.action}</div>
                              <div className="text-sm text-gray-500">IP: {activity.ip}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FaHistory className="text-4xl mx-auto mb-4 text-gray-300" />
                        <p>No activity records found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <FaTrash className="text-red-500 text-xl" />
                    </div>
                    <span>Danger Zone</span>
                  </h2>

                  <div className="space-y-6">
                    {/* Delete Account Card */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                          <FaTrash className="text-red-500 text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-red-700 mb-2">Delete Account</h3>
                          <p className="text-red-600 mb-4">
                            Once you delete your account, all your data will be permanently removed. This action cannot be undone. Please proceed with caution.
                          </p>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-red-700 mb-2">
                              Enter your password to confirm deletion
                            </label>
                            <div className="relative max-w-md">
                              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400" />
                              <input
                                type={showDeletePassword ? "text" : "password"}
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="w-full px-4 py-3 pl-12 bg-white border-2 border-red-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
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
                            disabled={isDeleting || !deletePassword}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                          >
                            <FaTrash />
                            {isDeleting ? "Deleting..." : "Delete My Account"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Logout Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-500/10 rounded-xl">
                          <FaSignOutAlt className="text-gray-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">Sign Out</h3>
                          <p className="text-gray-600 mb-4">
                            Sign out from your current session. You can log back in anytime with your credentials.
                          </p>
                          <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-gray-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                          >
                            <FaSignOutAlt />
                            Sign Out Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCashier;
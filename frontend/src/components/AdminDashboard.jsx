import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  UserPlus,
  Shield,
  ChevronRight,
  Bell,
  Search,
  Settings,
  LogOut,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  User as UserIcon,
  BarChart3,
  FileText,
  HelpCircle,
  User
} from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Read user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUserData(user);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Get user's first letter for avatar
  const getUserInitial = () => {
    if (!userData || !userData.username) return "A";
    return userData.username.charAt(0).toUpperCase();
  };

  // Get display name from email
  const getDisplayName = () => {
    if (!userData || !userData.username) return "Admin";
    const email = userData.username;
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (!userData || !userData.role) return "Administrator";
    return userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Check if path is active
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Admin menus
  const adminMenus = [
    { 
      name: "Dashboard", 
      path: "/admin/dash", 
      icon: <Home size={20} />, 
      description: "Overview and analytics"
    },
    { 
      name: "Register Cashier", 
      path: "/admin/register-cashier", 
      icon: <UserPlus size={20} />, 
      description: "Add new cashier accounts",
      
    },
    {
  name: "Profile",
  path: "/admin/profile",
  icon: <User size={20} />,      // Profile icon
  description: "Get profile",
  
},

   
  ];

  // Admin statistics
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/5">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield size={28} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading Admin Dashboard...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/5">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-all duration-300 ease-in-out z-50
          bg-white/95 backdrop-blur-lg shadow-2xl border-r border-[#05E2F2]/10`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#05E2F2]/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center shadow-lg shadow-[#05E2F2]/20">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-500 font-medium">System Administration</p>
            </div>
          </div>
          
          {/* Admin Profile Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-white to-[#05E2F2]/5 border border-[#05E2F2]/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">{getUserInitial()}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">{getDisplayName()}</p>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                  <Shield size={12} />
                  <span>{getRoleDisplay()}</span>
                </p>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {userData?.username || "admin@system.com"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Administration
            </p>
            <ul className="space-y-1">
              {adminMenus.map((menu) => {
                const isActive = isActivePath(menu.path);
                return (
                  <li key={menu.path}>
                    <NavLink
                      to={menu.path}
                      className={`flex items-start space-x-4 p-3.5 rounded-xl transition-all duration-300 group relative
                        ${isActive 
                          ? "bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white shadow-lg shadow-[#05E2F2]/25" 
                          : "text-gray-600 hover:text-[#05E2F2] hover:bg-[#05E2F2]/5 hover:shadow-md"
                        }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`mt-0.5 ${isActive ? "text-white" : "text-[#05E2F2]"}`}>
                        {menu.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{menu.name}</span>
                          {menu.badge && (
                            <span className={`px-2 py-0.5 text-xs rounded-full font-bold 
                              ${isActive 
                                ? "bg-white text-[#05E2F2]" 
                                : "bg-[#05E2F2] text-white"}`}>
                              {menu.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 truncate ${isActive ? "text-white/80" : "text-gray-500"}`}>
                          {menu.description}
                        </p>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className={`mt-0.5 transition-all duration-300 
                          ${isActive 
                            ? "text-white" 
                            : "text-gray-400 group-hover:text-[#05E2F2]"}`} 
                      />
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-8 px-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-600 flex items-center">
                <TrendingUp size={16} className="mr-2 text-[#05E2F2]" />
                System Stats
              </p>
              <span className="text-xs text-gray-400">Today</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* {adminStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-white/50 rounded-lg border border-[#05E2F2]/10 hover:bg-white transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold mt-2 inline-block px-2 py-1 rounded-full
                    ${stat.change.startsWith('+') 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              ))} */}
            </div>
          </div>

          {/* Help Section */}
          {/* <div className="mt-6 p-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-[#05E2F2]/10 to-[#05E2F2]/5 border border-[#05E2F2]/20">
              <div className="flex items-center space-x-2">
                <HelpCircle size={16} className="text-[#05E2F2]" />
                <span className="text-sm font-medium text-gray-700">Need Help?</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Check our documentation or contact support</p>
              <button className="w-full mt-2 px-3 py-1.5 text-xs bg-white text-[#05E2F2] rounded-md border border-[#05E2F2]/30 hover:bg-[#05E2F2]/5 transition-colors">
                Get Support
              </button>
            </div>
          </div> */}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#05E2F2]/10 bg-white/80 backdrop-blur-sm">
          <button 
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/70 text-white font-medium hover:shadow-lg hover:shadow-[#05E2F2]/30 transition-all duration-200 group"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-80 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#05E2F2]/10 shadow-sm">
          <div className="flex items-center justify-between p-4 md:px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-[#05E2F2]/10 transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X size={24} className="text-gray-700" />
                ) : (
                  <Menu size={24} className="text-gray-700" />
                )}
              </button>
              
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Admin</span>
                <ChevronRight size={16} className="text-gray-300" />
                <span className="font-medium text-[#05E2F2]">
                  {adminMenus.find(m => isActivePath(m.path))?.name || "Dashboard"}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            {/* <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users, settings, reports..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-[#05E2F2]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/30 focus:border-transparent shadow-sm"
                />
              </div>
            </div> */}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              {/* <button className="relative p-2.5 rounded-xl hover:bg-[#05E2F2]/10 transition-colors group" aria-label="Notifications">
                <Bell size={22} className="text-gray-600 group-hover:text-[#05E2F2]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button> */}
              
              {/* Quick Actions */}
              <button 
                className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white font-medium hover:shadow-lg hover:shadow-[#05E2F2]/30 transition-all duration-200"
                onClick={() => navigate("/admin/register-cashier")}
              >
                <UserPlus size={18} />
                <span>Add User</span>
              </button>
              
              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-800">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center cursor-pointer shadow-md">
                    <span className="text-white font-bold">{getUserInitial()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-white to-[#05E2F2]/5">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome, {getDisplayName()}! 👋</h2>
                  <p className="opacity-90">System administration and management dashboard</p>
                  <div className="flex items-center space-x-3 mt-3">
                    <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full flex items-center space-x-1">
                      <Shield size={12} />
                      <span>{getRoleDisplay()}</span>
                    </span>
                    <span className="text-xs opacity-75">
                      Last login: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="px-6 py-3 bg-white text-[#05E2F2] rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg flex items-center space-x-2">
                    <BarChart3 size={20} />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#05E2F2]/10 overflow-hidden">
              <div className="p-1">
                <div className="rounded-xl overflow-hidden">
                  <Outlet />
                </div>
              </div>
            </div>

            {/* Footer */}
            {/* <footer className="mt-8 text-center">
              <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#05E2F2]/10 flex items-center justify-center">
                    <Shield size={12} className="text-[#05E2F2]" />
                  </div>
                  <span>© {new Date().getFullYear()} Admin Panel v2.0</span>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-xs text-gray-400">
                    Logged in as: <span className="text-[#05E2F2] font-medium">{userData?.username}</span>
                  </p>
                </div>
              </div>
            </footer> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Package, 
  Droplets, 
  User,
  ChevronRight,
  Bell,
  Search,
  Settings,
  LogOut,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  CreditCard,
  Shield
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Read user data from localStorage on component mount
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserData(user);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Get user's first letter for avatar
  const getUserInitial = () => {
    if (!userData || !userData.username) return "U";
    return userData.username.charAt(0).toUpperCase();
  };

  // Get display name from email
  const getDisplayName = () => {
    if (!userData || !userData.username) return "User";
    const email = userData.username;
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (!userData || !userData.role) return "User";
    const role = userData.role;
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get role icon
  const getRoleIcon = () => {
    if (!userData || !userData.role) return <User size={14} />;
    const role = userData.role;
    if (role === "cashier") return <CreditCard size={14} />;
    if (role === "admin") return <Shield size={14} />;
    return <User size={14} />;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Menus based on user role
  const getMenus = () => {
    const baseMenus = [
      { name: "Dashboard", path: "/dashboard", icon: <Home size={22} />,  },
      { name: "Customers", path: "/dashboard/customers", icon: <Users size={22} /> },
      { name: "Items", path: "/dashboard/items", icon: <Package size={22} /> },
    ];

    const laundryMenus = [
      { name: "Laundry", path: "/dashboard/laundry", icon: <Droplets size={22} />,  },
      { name: "Ironing", path: "/dashboard/ironing", icon: <Sparkles size={22} /> },
    ];

    const profileMenu = { name: "Profile", path: "/dashboard/profile", icon: <User size={22} /> };

    if (userData && userData.role === "cashier") {
      return [...baseMenus, ...laundryMenus, profileMenu];
    }
    
    return [...baseMenus, ...laundryMenus, profileMenu];
  };

  // const stats = [
  //   { label: "Today's Orders", value: "24", change: "+12%", icon: <Calendar size={16} /> },
  //   { label: "Processing", value: "8", change: "+3%", icon: <Clock size={16} /> },
  //   { label: "Completed", value: "42", change: "+18%", icon: <CheckCircle size={16} /> },
  //   { label: "Pending", value: "12", change: "-2%", icon: <AlertCircle size={16} /> },
  // ];

  // Show loading state while checking user data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05E2F2]/5 via-white/50 to-[#05E2F2]/5">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Droplets size={28} className="text-white" />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Helper function to check if a path is active
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white/50 to-[#05E2F2]/5">
      
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
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center shadow-lg shadow-[#05E2F2]/20">
              <Droplets size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 bg-clip-text text-transparent">
                LaundryFlow Pro
              </h1>
              <p className="text-xs text-gray-500 font-medium">Smart Laundry Management</p>
            </div>
          </div>
          
          {/* User Profile Card */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-white to-[#05E2F2]/5 border border-[#05E2F2]/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">{getUserInitial()}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{getDisplayName()}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-gray-500">{getRoleIcon()}</span>
                    <span className="text-gray-500">{getRoleDisplay()}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {userData.username}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Main Navigation
            </p>
            <ul className="space-y-1">
              {getMenus().map((menu) => {
                const isActive = isActivePath(menu.path);
                return (
                  <li key={menu.path}>
                    <NavLink
                      to={menu.path}
                      className={`flex items-center space-x-4 p-3.5 rounded-xl transition-all duration-300 group relative
                        ${isActive 
                          ? "bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white shadow-lg shadow-[#05E2F2]/25 transform scale-[1.02]" 
                          : "text-gray-600 hover:text-[#05E2F2] hover:bg-[#05E2F2]/5 hover:shadow-md"
                        }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={isActive ? "text-white" : "text-[#05E2F2]"}>
                        {menu.icon}
                      </div>
                      <span className="font-medium flex-1">{menu.name}</span>
                      {menu.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full font-bold 
                          ${isActive 
                            ? "bg-white text-[#05E2F2]" 
                            : "bg-[#05E2F2] text-white"}`}>
                          {menu.badge}
                        </span>
                      )}
                      <ChevronRight 
                        size={18} 
                        className={`transition-all duration-300 
                          ${isActive 
                            ? "text-white opacity-100" 
                            : "text-gray-400 opacity-0 group-hover:opacity-100"}`} 
                      />
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-8 px-3">
            {/* <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
              <TrendingUp size={16} className="mr-2 text-[#05E2F2]" />
              Today's Overview
            </p> */}
            <div className="space-y-3">
              {/* {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-[#05E2F2]/10 hover:bg-white transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#05E2F2]/10 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full
                    ${stat.change.startsWith('+') 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              ))} */}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#05E2F2]/10 bg-white/80 backdrop-blur-sm">
          <div className="flex space-x-2">
            {/* <button 
              className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-[#05E2F2]/10 text-[#05E2F2] hover:bg-[#05E2F2]/20 transition-all duration-200 group"
              onClick={() => navigate("/dashboard/orders")}
            >
              <Settings size={18} />
              <span className="font-medium">Settings</span>
            </button> */}
            <button 
              className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/70 text-white hover:shadow-lg hover:shadow-[#05E2F2]/30 transition-all duration-200 group"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
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
              
              {/* Breadcrumb for Desktop */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Dashboard</span>
                <ChevronRight size={16} className="text-gray-300" />
                <span className="font-medium text-[#05E2F2]">Overview</span>
              </div>
            </div>

            {/* Search Bar - Center */}
            {/* <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search orders, customers, items... (${getRoleDisplay()})`}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#05E2F2]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/30 focus:border-transparent shadow-sm"
                />
              </div>
            </div> */}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              {/* <button className="relative p-2.5 rounded-xl hover:bg-[#05E2F2]/10 transition-colors group" aria-label="Notifications">
                <Bell size={22} className="text-gray-600 group-hover:text-[#05E2F2]" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              </button> */}
              
              {/* Quick Actions - Only show for cashier */}
              {/* {userData.role === "cashier" && (
                <button className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 text-white font-medium hover:shadow-lg hover:shadow-[#05E2F2]/30 transition-all duration-200">
                  <span>+ New Order</span>
                </button>
              )} */}
              
              {/* User Profile Dropdown */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-800">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">
                    {userData.role === "cashier" ? "Cashier Account" : "Administrator"}
                  </p>
                </div>
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center cursor-pointer shadow-md">
                    <span className="text-white font-bold">{getUserInitial()}</span>
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-[#05E2F2]/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-[#05E2F2]/10">
                      <p className="font-semibold text-gray-800">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500 flex items-center space-x-1">
                        {getRoleIcon()}
                        <span>{getRoleDisplay()}</span>
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-1">{userData.username}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-[#05E2F2]/5 text-gray-600 hover:text-[#05E2F2] transition-colors"
                        onClick={() => navigate("/dashboard/orders")}
                      >
                        My Profile
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-[#05E2F2]/5 text-gray-600 hover:text-[#05E2F2] transition-colors"
                        onClick={() => navigate("/dashboard/settings")}
                      >
                        Account Settings
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-[#05E2F2]/5 text-red-500 hover:bg-red-50 transition-colors"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
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
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {getDisplayName()}! 👋</h2>
                  <p className="opacity-90">
                    {userData.role === "cashier" 
                      ? "Ready to manage today's laundry orders?" 
                      : "Here's what's happening with your laundry business today."}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {getRoleDisplay()}
                    </span>
                    <span className="text-xs opacity-75">
                      Last login: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="px-6 py-3 bg-white text-[#05E2F2] rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                    View Full Report
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
            <footer className="mt-8 text-center">
              <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#05E2F2]/10 flex items-center justify-center">
                    <Droplets size={12} className="text-[#05E2F2]" />
                  </div>
                  <span>© {new Date().getFullYear()} LaundryFlow Pro</span>
                </div>
                <div className="mt-2 md:mt-0 flex items-center space-x-4">
                  <span className="hover:text-[#05E2F2] cursor-pointer">Privacy Policy</span>
                  <span>•</span>
                  <span className="hover:text-[#05E2F2] cursor-pointer">Terms of Service</span>
                  <span>•</span>
                  <span className="hover:text-[#05E2F2] cursor-pointer">Support</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Version 2.1.0 • Logged in as: {userData.username}
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
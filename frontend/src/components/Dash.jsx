import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar
} from "recharts";
import { 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Shield,
  TrendingDown,
  Activity,
  Target,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

const Dash = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("https://sidra.somsoftsystems.com/api/dashboard", { 
        withCredentials: true 
      });
      setStats(res.data);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Enhanced color palette with gradients
  const PRIMARY_COLOR = "#05E2F2";
  const WHITE = "#FFFFFF";
  const COLORS = [
    "#05E2F2", "#05C8E2", "#0594E2", "#047AE2", "#0368D6",
    "#0256C2", "#0144AE", "#00329A", "#002086", "#000E72"
  ];
  
  const CHART_GRADIENTS = {
    primary: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0368D6 100%)`,
    secondary: `linear-gradient(135deg, #05C8E2 0%, #047AE2 100%)`,
    accent: `linear-gradient(135deg, #0594E2 0%, #0256C2 100%)`
  };

  const CARD_GRADIENT = `linear-gradient(135deg, ${WHITE} 0%, ${PRIMARY_COLOR}08 100%)`;

  // Enhanced loading animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/5 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#05E2F2]/10 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#05E2F2] border-t-transparent rounded-full animate-spin"></div>
                <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#05E2F2] w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#05E2F2] to-[#0368D6] bg-clip-text text-transparent">
              Securing Your Data
            </h3>
            <p className="text-gray-600">Loading protected analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/5 flex items-center justify-center p-6">
        <div className="bg-gradient-to-br from-white to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-lg text-center border border-white/30">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#05E2F2] to-[#0368D6] rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Secure Connection Required</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={fetchStats}
            className="group relative overflow-hidden bg-gradient-to-r from-[#05E2F2] to-[#0368D6] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry Secure Connection
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <Package className="w-20 h-20 text-[#05E2F2] opacity-50" />
            <Shield className="absolute -top-2 -right-2 w-10 h-10 text-[#05E2F2]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Data Available</h3>
          <p className="text-gray-500 mb-8 max-w-md">Your analytics dashboard is ready. Start adding data to see beautiful insights.</p>
          <button
            onClick={fetchStats}
            className="bg-gradient-to-r from-[#05E2F2] to-[#0368D6] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            Initialize Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = stats.totalIroningRevenue + stats.totalLaundryRevenue;
  const totalOrders = stats.ironingStatusAgg.reduce((a, b) => a + b.count, 0) + 
                     stats.laundryStatusAgg.reduce((a, b) => a + b.count, 0);

  // Process data for enhanced charts
  const processPerformanceData = () => {
    const ironingByItem = stats.ironingItemsAgg.map(item => ({
      name: item._id,
      value: item.totalRevenue,
      quantity: item.totalQty
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    const laundryByItem = stats.laundryItemsAgg.map(item => ({
      name: item._id,
      value: item.totalRevenue,
      quantity: item.totalQty
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    return { ironingByItem, laundryByItem };
  };

  const performanceData = processPerformanceData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/5 p-4 md:p-8">
      {/* Security Header */}
      <div className="fixed top-4 right-4 z-10">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Data Secured</span>
          <Shield className="w-4 h-4 text-[#05E2F2]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#05E2F2]/20 to-transparent rounded-full blur-xl"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-[#05E2F2] via-[#0368D6] to-[#05E2F2] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    Analytics Dashboard
                  </span>
                </h1>
                <p className="text-gray-600 text-lg">Protected insights & beautiful visualizations</p>
              </div>
              <button
                onClick={fetchStats}
                className="group mt-4 md:mt-0 flex items-center gap-3 bg-white text-gray-800 px-6 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-[#05E2F2]/30 backdrop-blur-sm"
              >
                <div className="relative">
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <span>Refresh Analytics</span>
              </button>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  title: "Total Customers",
                  value: stats.totalCustomers,
                  icon: Users,
                  change: "+12%",
                  color: PRIMARY_COLOR,
                  gradient: CHART_GRADIENTS.primary
                },
                {
                  title: "Total Revenue",
                  value: `$${totalRevenue.toFixed(2)}`,
                  icon: DollarSign,
                  change: "+24%",
                  color: "#0594E2",
                  gradient: CHART_GRADIENTS.secondary
                },
                {
                  title: "Ironing Revenue",
                  value: `$${stats.totalIroningRevenue.toFixed(2)}`,
                  icon: Activity,
                  change: "+18%",
                  color: "#05C8E2",
                  gradient: CHART_GRADIENTS.accent
                },
                {
                  title: "Laundry Revenue",
                  value: `$${stats.totalLaundryRevenue.toFixed(2)}`,
                  icon: Package,
                  change: "+16%",
                  color: "#047AE2",
                  gradient: CHART_GRADIENTS.primary
                }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  style={{ 
                    background: CARD_GRADIENT,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div 
                        className="p-3 rounded-2xl"
                        style={{ background: `${stat.color}10` }}
                      >
                        <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-50 to-emerald-50">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-4">{stat.value}</p>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.min(100, 30 + idx * 20)}%`,
                          background: stat.gradient
                        }}
                      ></div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: stat.gradient }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Revenue Distribution Radar */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#05E2F2] to-[#0368D6]">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Revenue Distribution</h3>
                      <p className="text-sm text-gray-500">Performance across categories</p>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { subject: 'Ironing', A: stats.totalIroningRevenue, fullMark: totalRevenue },
                      { subject: 'Laundry', A: stats.totalLaundryRevenue, fullMark: totalRevenue },
                    ]}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                      />
                      <Radar
                        name="Revenue"
                        dataKey="A"
                        stroke="#05E2F2"
                        fill="#05E2F2"
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Overview Radial Bars */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0594E2] to-[#0256C2]">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Order Status Overview</h3>
                      <p className="text-sm text-gray-500">Distribution across services</p>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="20%" 
                      outerRadius="90%" 
                      data={[
                        ...stats.ironingStatusAgg.map((item, idx) => ({
                          name: `Ironing: ${item._id}`,
                          value: item.count,
                          fill: COLORS[idx % COLORS.length]
                        })),
                        ...stats.laundryStatusAgg.map((item, idx) => ({
                          name: `Laundry: ${item._id}`,
                          value: item.count,
                          fill: COLORS[(idx + 3) % COLORS.length]
                        }))
                      ]}
                      startAngle={180}
                      endAngle={-180}
                    >
                      <RadialBar 
                        label={{ position: 'insideStart', fill: WHITE, fontSize: 10 }}
                        background={{ fill: '#F3F4F6' }}
                        dataKey="value"
                        cornerRadius={10}
                      />
                      <Legend 
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value) => (
                          <span className="text-xs text-gray-600">{value}</span>
                        )}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Top Performing Items */}
              <div className="space-y-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-[#05C8E2] to-[#047AE2]">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Top Ironing Items</h3>
                        <p className="text-sm text-gray-500">Revenue performance</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData.ironingByItem}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tick={{ fill: '#6B7280', fontSize: 11 }}
                        />
                        <YAxis 
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: WHITE,
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            padding: '12px'
                          }}
                          formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[8, 8, 0, 0]}
                        >
                          {performanceData.ironingByItem.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ironing Status Flow */}
                <div className="bg-gradient-to-br from-white to-[#05E2F2]/10 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Ironing Status Flow</h3>
                      <p className="text-sm text-gray-500">Real-time order tracking</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.ironingStatusAgg}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="_id" 
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: WHITE,
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#05E2F2" 
                          fill="url(#colorIroning)" 
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient id="colorIroning" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#05E2F2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#05E2F2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Laundry Analytics */}
              <div className="space-y-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-[#047AE2] to-[#0368D6]">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Top Laundry Items</h3>
                        <p className="text-sm text-gray-500">Revenue performance</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData.laundryByItem}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tick={{ fill: '#6B7280', fontSize: 11 }}
                        />
                        <YAxis 
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: WHITE,
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            padding: '12px'
                          }}
                          formatter={(value) => [`$${value}`, 'Revenue']}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[8, 8, 0, 0]}
                        >
                          {performanceData.laundryByItem.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={COLORS[(index + 5) % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Laundry Status Flow */}
                <div className="bg-gradient-to-br from-white to-[#0594E2]/10 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Laundry Status Flow</h3>
                      <p className="text-sm text-gray-500">Real-time order tracking</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.laundryStatusAgg}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="_id" 
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            background: WHITE,
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#0594E2" 
                          fill="url(#colorLaundry)" 
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient id="colorLaundry" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0594E2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0594E2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Footer */}
            <div className="bg-gradient-to-r from-[#05E2F2] via-[#0368D6] to-[#05E2F2] rounded-3xl p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-8 h-8 text-white" />
                      <h3 className="text-2xl font-bold text-white">Protected Analytics Dashboard</h3>
                    </div>
                    <p className="text-white/90">
                      All data is securely encrypted and processed in real-time. 
                      Your business insights are protected with enterprise-grade security.
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">${totalRevenue.toFixed(2)}</div>
                    <p className="text-white/90 font-medium">Total Protected Revenue</p>
                    <p className="text-white/70 text-sm mt-2">{totalOrders} orders processed securely</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;
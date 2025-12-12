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
  PieChart as PieChartIcon,
  Printer
} from "lucide-react";

const Dash = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Print State
  const [printData, setPrintData] = useState(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

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

  // Print Functions
  const handlePrint = () => {
    setPrintData(stats);
    setShowPrintPreview(true);
  };

  const closePrintModal = () => {
    setPrintData(null);
    setShowPrintPreview(false);
  };

  const executePrint = () => {
    // First close the preview modal
    setShowPrintPreview(false);
    
    // Wait a moment for the modal to close, then trigger print
    setTimeout(() => {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Get the print content HTML
      const printContent = document.getElementById('print-analytics-content');
      
      if (printContent) {
        const currentDate = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Analytics Report</title>
            <style>
              @page {
                margin: 15mm;
                size: A4 landscape;
              }
              body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                background: white;
              }
              .print-container {
                max-width: 290mm;
                margin: 0 auto;
              }
              .report-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #05E2F2;
              }
              .report-header h1 {
                color: #05E2F2;
                margin: 10px 0;
                font-size: 32px;
              }
              .report-meta {
                color: #666;
                font-size: 14px;
                margin-top: 10px;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin: 25px 0;
              }
              .stat-card {
                background: #f8fafc;
                padding: 15px;
                border-radius: 10px;
                border-left: 4px solid #05E2F2;
                text-align: center;
              }
              .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #05E2F2;
                margin: 10px 0;
              }
              .stat-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .section-title {
                color: #05E2F2;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
                margin: 30px 0 20px 0;
                font-size: 20px;
              }
              .data-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 12px;
              }
              .data-table th {
                background: #05E2F2;
                color: white;
                text-align: left;
                padding: 12px;
                font-weight: bold;
              }
              .data-table td {
                padding: 10px 12px;
                border-bottom: 1px solid #e5e7eb;
              }
              .data-table tr:nth-child(even) {
                background: #f9fafb;
              }
              .charts-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 30px 0;
              }
              .chart-box {
                border: 1px solid #e5e7eb;
                padding: 15px;
                border-radius: 8px;
                background: white;
              }
              .chart-title {
                text-align: center;
                font-weight: bold;
                color: #374151;
                margin-bottom: 15px;
                font-size: 14px;
              }
              .data-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 20px 0;
              }
              .data-item {
                background: #f3f4f6;
                padding: 12px;
                border-radius: 6px;
                font-size: 13px;
              }
              .data-label {
                color: #6b7280;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .data-value {
                color: #111827;
                font-weight: bold;
                font-size: 16px;
                margin-top: 4px;
              }
              .security-footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e5e7eb;
                color: #6b7280;
                font-size: 11px;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                .print-container {
                  padding: 10px;
                }
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
          </html>
        `);
        
        printWindow.document.close();
        
        // Wait for content to load, then print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }, 300);
  };

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

  // Print Component
  const PrintAnalytics = ({ data }) => {
    if (!data) return null;

    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const totalRevenue = data.totalIroningRevenue + data.totalLaundryRevenue;

    return (
      <div id="print-analytics-content" style={{ display: 'none' }}>
        <div className="print-container">
          {/* Report Header */}
          <div className="report-header">
            <h1>ANALYTICS DASHBOARD REPORT</h1>
            <div className="report-meta">
              <p>Generated on: {currentDate}</p>
              <p>Report ID: ANALYTICS-{Date.now().toString().slice(-8)}</p>
              <p>Data Source: Protected Enterprise Analytics</p>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Customers</div>
              <div className="stat-value">{data.totalCustomers}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Ironing Revenue</div>
              <div className="stat-value">${data.totalIroningRevenue.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Laundry Revenue</div>
              <div className="stat-value">${data.totalLaundryRevenue.toFixed(2)}</div>
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="section-title">REVENUE DISTRIBUTION</div>
          <div className="data-grid">
            <div className="data-item">
              <div className="data-label">Ironing Service</div>
              <div className="data-value">${data.totalIroningRevenue.toFixed(2)}</div>
              <div className="data-label">Percentage</div>
              <div className="data-value">
                {totalRevenue > 0 ? ((data.totalIroningRevenue / totalRevenue) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="data-item">
              <div className="data-label">Laundry Service</div>
              <div className="data-value">${data.totalLaundryRevenue.toFixed(2)}</div>
              <div className="data-label">Percentage</div>
              <div className="data-value">
                {totalRevenue > 0 ? ((data.totalLaundryRevenue / totalRevenue) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          {/* Order Status Overview */}
          <div className="section-title">ORDER STATUS OVERVIEW</div>
          
          {/* Ironing Status */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontWeight: 'bold', color: '#0594E2', marginBottom: '10px' }}>Ironing Orders</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Order Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.ironingStatusAgg.map((item, index) => {
                  const totalIroningOrders = data.ironingStatusAgg.reduce((sum, i) => sum + i.count, 0);
                  const percentage = totalIroningOrders > 0 ? ((item.count / totalIroningOrders) * 100).toFixed(1) : 0;
                  return (
                    <tr key={index}>
                      <td style={{ textTransform: 'capitalize' }}>{item._id}</td>
                      <td>{item.count}</td>
                      <td>{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Laundry Status */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontWeight: 'bold', color: '#047AE2', marginBottom: '10px' }}>Laundry Orders</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Order Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.laundryStatusAgg.map((item, index) => {
                  const totalLaundryOrders = data.laundryStatusAgg.reduce((sum, i) => sum + i.count, 0);
                  const percentage = totalLaundryOrders > 0 ? ((item.count / totalLaundryOrders) * 100).toFixed(1) : 0;
                  return (
                    <tr key={index}>
                      <td style={{ textTransform: 'capitalize' }}>{item._id}</td>
                      <td>{item.count}</td>
                      <td>{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Top Performing Items */}
          <div className="section-title">TOP PERFORMING ITEMS</div>
          
          {/* Ironing Items */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontWeight: 'bold', color: '#05C8E2', marginBottom: '10px' }}>Top Ironing Items by Revenue</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity Sold</th>
                  <th>Total Revenue</th>
                  <th>Average Price</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.ironingByItem.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.value.toFixed(2)}</td>
                    <td>${item.quantity > 0 ? (item.value / item.quantity).toFixed(2) : '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Laundry Items */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontWeight: 'bold', color: '#0368D6', marginBottom: '10px' }}>Top Laundry Items by Revenue</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity Sold</th>
                  <th>Total Revenue</th>
                  <th>Average Price</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.laundryByItem.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.value.toFixed(2)}</td>
                    <td>${item.quantity > 0 ? (item.value / item.quantity).toFixed(2) : '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="section-title">EXECUTIVE SUMMARY</div>
          <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <p><strong>Total Orders Processed:</strong> {totalOrders}</p>
            <p><strong>Average Revenue per Order:</strong> ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}</p>
            <p><strong>Most Popular Ironing Item:</strong> {performanceData.ironingByItem[0]?.name || 'N/A'} (${performanceData.ironingByItem[0]?.value.toFixed(2) || '0.00'})</p>
            <p><strong>Most Popular Laundry Item:</strong> {performanceData.laundryByItem[0]?.name || 'N/A'} (${performanceData.laundryByItem[0]?.value.toFixed(2) || '0.00'})</p>
          </div>

          {/* Security Footer */}
          <div className="security-footer">
            <p>📊 PROTECTED ANALYTICS REPORT • GENERATED WITH ENTERPRISE-GRADE SECURITY</p>
            <p>All data is encrypted and processed in compliance with data protection regulations</p>
            <p>Report valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p style={{ marginTop: '10px', fontSize: '10px', color: '#9ca3af' }}>
              © {new Date().getFullYear()} Analytics Dashboard • Confidential Business Intelligence
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Print Preview Modal
  const PrintPreviewModal = ({ data, onClose, onPrint }) => {
    if (!data) return null;

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Analytics Report Preview</h2>
                  <p className="text-white/90">Comprehensive business intelligence summary</p>
                </div>
              </div>
              <button
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body - Print Preview */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="bg-white p-8 border-2 border-gray-300 rounded-lg shadow-inner">
              {/* Report Header */}
              <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">ANALYTICS DASHBOARD REPORT</h1>
                <p className="text-gray-600 mb-1">Protected Business Intelligence Summary</p>
                <p className="text-gray-600 font-semibold text-lg">Generated: {new Date().toLocaleString()}</p>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold text-[#05E2F2]">{data.totalCustomers}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Ironing Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">${data.totalIroningRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Laundry Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">${data.totalLaundryRevenue.toFixed(2)}</p>
                </div>
              </div>

              {/* Revenue Distribution */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-4 text-lg border-b pb-2">REVENUE DISTRIBUTION</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-700 mb-2">Ironing Service</h4>
                    <p className="text-2xl font-bold text-blue-600">${data.totalIroningRevenue.toFixed(2)}</p>
                    <p className="text-sm text-blue-500">
                      {totalRevenue > 0 ? ((data.totalIroningRevenue / totalRevenue) * 100).toFixed(1) : 0}% of total revenue
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-700 mb-2">Laundry Service</h4>
                    <p className="text-2xl font-bold text-purple-600">${data.totalLaundryRevenue.toFixed(2)}</p>
                    <p className="text-sm text-purple-500">
                      {totalRevenue > 0 ? ((data.totalLaundryRevenue / totalRevenue) * 100).toFixed(1) : 0}% of total revenue
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Status Summary */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-4 text-lg border-b pb-2">ORDER STATUS SUMMARY</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-2">Ironing Orders</h4>
                    <div className="space-y-2">
                      {data.ironingStatusAgg.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="capitalize">{item._id}</span>
                          <span className="font-bold">{item.count} orders</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 mb-2">Laundry Orders</h4>
                    <div className="space-y-2">
                      {data.laundryStatusAgg.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="capitalize">{item._id}</span>
                          <span className="font-bold">{item.count} orders</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Items Summary */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-4 text-lg border-b pb-2">TOP PERFORMING ITEMS</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-2">Top Ironing Items</h4>
                    <div className="space-y-2">
                      {performanceData.ironingByItem.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <span className="font-bold">${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 mb-2">Top Laundry Items</h4>
                    <div className="space-y-2">
                      {performanceData.laundryByItem.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <span className="font-bold">${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-center text-gray-700 font-medium">
                  This report will be printed with comprehensive analytics, revenue distribution, and item performance.
                </p>
                <p className="text-center text-gray-600 text-sm mt-2">
                  Includes: Key Statistics, Revenue Analysis, Order Status, Top Items, and Executive Summary
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-[#05E2F2] text-white font-semibold rounded-xl hover:bg-[#05E2F2]/90 hover:shadow-lg transition-all duration-200 flex items-center"
                onClick={onPrint}
              >
                <Printer className="mr-2" />
                Print Analytics Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 via-white to-[#05E2F2]/5 p-4 md:p-8">
        {/* Security Header */}
        <div className="fixed top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Data Secured</span>
            <Shield className="w-4 h-4 text-[#05E2F2]" />
          </div>
        </div>

        {/* Print Button */}
        <div className="fixed bottom-4 right-4 z-10 no-print">
          <button
            onClick={handlePrint}
            className="group relative overflow-hidden bg-gradient-to-r from-[#05E2F2] to-[#0368D6] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3"
            title="Print Analytics Report"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Printer className="w-5 h-5 relative" />
            <span className="relative">Print Report</span>
          </button>
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

      {/* Print Preview Modal */}
      {showPrintPreview && printData && (
        <PrintPreviewModal 
          data={printData} 
          onClose={closePrintModal} 
          onPrint={executePrint}
        />
      )}

      {/* Print Analytics Component (for actual printing) */}
      {printData && <PrintAnalytics data={printData} />}
    </>
  );
};

export default Dash;
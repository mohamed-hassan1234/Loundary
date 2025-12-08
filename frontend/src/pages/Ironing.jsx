import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const Ironing = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    customer: "",
    items: [{ itemName: "", qty: 1 }],
    ironingPrice: 0,
    pickupTime: "",
  });

  // const API_ORDERS = "http://localhost:5000/api/ironing";
  //  const API_CUSTOMERS = "http://localhost:5000/api/customers";
  // const API_ITEMS = "http://localhost:5000/api/items";
  const API_ORDERS = "https://sidra.somsoftsystems.com/api/ironing";
  const API_CUSTOMERS = "https://sidra.somsoftsystems.com/api/customers";
  const API_ITEMS = "https://sidra.somsoftsystems.com/api/items";

  // --- Fetch data ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, itemsRes] = await Promise.all([
        axios.get(API_ORDERS),
        axios.get(API_CUSTOMERS),
        axios.get(API_ITEMS),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setItemsList(itemsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Search functionality ---
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;

    const searchLower = searchTerm.toLowerCase();
    return orders.filter(order => {
      // Search by customer name
      if (order.customer?.fullName?.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search by order ID
      if (order._id?.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search by status
      if (order.status?.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search by items
      const hasMatchingItem = order.items?.some(item =>
        item.itemName?.toLowerCase().includes(searchLower)
      );
      if (hasMatchingItem) {
        return true;
      }
      
      // Search by price
      if (order.ironingPrice?.toString().includes(searchTerm)) {
        return true;
      }
      
      // Search by date (format: MM/DD/YYYY or similar)
      const orderDate = new Date(order.registerDate);
      const dateString = orderDate.toLocaleDateString().toLowerCase();
      if (dateString.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
  }, [orders, searchTerm]);

  // --- Modal ---
  const openModal = () => {
    setFormData({
      customer: "",
      items: [{ itemName: "", qty: 1 }],
      ironingPrice: 0,
      pickupTime: "",
    });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // --- Form handling ---
  const handleChange = (e, index = null, field = null) => {
    if (index !== null && field !== null) {
      const newItems = [...formData.items];
      newItems[index][field] = field === "qty" ? Number(e.target.value) : e.target.value;
      // Calculate ironingPrice automatically (assuming $0.5 per item)
      const total = newItems.reduce((acc, it) => acc + it.qty * 0.5, 0);
      setFormData({ ...formData, items: newItems, ironingPrice: total });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addItemRow = () => setFormData({
    ...formData,
    items: [...formData.items, { itemName: "", qty: 1 }],
    ironingPrice: formData.ironingPrice
  });

  const removeItemRow = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const total = newItems.reduce((acc, it) => acc + it.qty * 0.5, 0);
    setFormData({ ...formData, items: newItems, ironingPrice: total });
  };

  // --- CRUD ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_ORDERS, formData);
      fetchData();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${API_ORDERS}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_ORDERS}/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Format date with seconds
  const formatDateTimeWithSeconds = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Status color variants using only #05E2F2
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#05E2F2]/20 text-[#05E2F2]';
      case 'ready': return 'bg-[#05E2F2]/30 text-[#05E2F2]';
      case 'delivered': return 'bg-[#05E2F2]/40 text-[#05E2F2]';
      default: return 'bg-[#05E2F2]/10 text-[#05E2F2]';
    }
  };

  // Status icons using SVG paths
  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'ready':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'delivered':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-6a1 1 0 00-1-1h-8V5a1 1 0 00-1-1H3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 to-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#05E2F2] mb-2">
              Ironing Orders
            </h1>
            <p className="text-[#05E2F2]/70">Manage all ironing orders efficiently</p>
          </div>
          <button
            onClick={openModal}
            className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-[#05E2F2] hover:bg-[#05E2F2]/90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Order
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#05E2F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders by customer, status, items, price, or date..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#05E2F2]/30 rounded-xl shadow-sm focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-transparent outline-none text-gray-900 placeholder-[#05E2F2]/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#05E2F2] hover:text-[#05E2F2]/70"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="mt-2 text-sm text-[#05E2F2]/60">
              {searchTerm ? (
                <span>
                  Found {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} matching "{searchTerm}"
                </span>
              ) : (
                <span>Search across all order details to find what you need</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#05E2F2]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#05E2F2]/60 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-[#05E2F2]">{orders.length}</p>
              </div>
              <div className="p-3 bg-[#05E2F2]/10 rounded-lg">
                <svg className="w-8 h-8 text-[#05E2F2]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#05E2F2]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#05E2F2]/60 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-[#05E2F2]">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-[#05E2F2]/10 rounded-lg">
                <StatusIcon status="pending" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#05E2F2]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#05E2F2]/60 text-sm font-medium">Ready</p>
                <p className="text-3xl font-bold text-[#05E2F2]">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
              </div>
              <div className="p-3 bg-[#05E2F2]/10 rounded-lg">
                <StatusIcon status="ready" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#05E2F2]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#05E2F2]/60 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-[#05E2F2]">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="p-3 bg-[#05E2F2]/10 rounded-lg">
                <StatusIcon status="delivered" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#05E2F2]/20">
        <div className="px-6 py-4 border-b border-[#05E2F2]/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#05E2F2]">
            {searchTerm ? `Search Results (${filteredOrders.length})` : 'All Orders'}
          </h2>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="text-sm text-[#05E2F2] hover:text-[#05E2F2]/80 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Search
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#05E2F2]/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#05E2F2] uppercase tracking-wider">Customer & Order Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#05E2F2] uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#05E2F2] uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#05E2F2] uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#05E2F2] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#05E2F2] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#05E2F2]/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05E2F2]"></div>
                    </div>
                    <p className="mt-4 text-[#05E2F2]/60">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="mx-auto mb-4 p-4 bg-[#05E2F2]/10 rounded-full w-16 h-16 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#05E2F2]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {searchTerm ? (
                      <>
                        <p className="text-[#05E2F2]/70 text-lg">No orders found for "{searchTerm}"</p>
                        <button
                          onClick={clearSearch}
                          className="mt-4 text-[#05E2F2] hover:text-[#05E2F2]/80 font-medium"
                        >
                          Clear search
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-[#05E2F2]/70 text-lg">No orders found</p>
                        <button
                          onClick={openModal}
                          className="mt-4 text-[#05E2F2] hover:text-[#05E2F2]/80 font-medium"
                        >
                          Create your first order
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#05E2F2]/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-[#05E2F2]/10 p-3 rounded-xl mr-4">
                          <svg className="w-6 h-6 text-[#05E2F2]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{order.customer?.fullName}</p>
                          <div className="space-y-1 mt-1">
                            <p className="text-sm text-[#05E2F2]/70">
                              <span className="font-medium">Created:</span> {formatDateTimeWithSeconds(order.registerDate)}
                            </p>
                            <p className="text-xs text-[#05E2F2]/50">
                              {getRelativeTime(order.registerDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="w-2 h-2 bg-[#05E2F2] rounded-full mr-2"></div>
                            <span className="font-medium text-gray-900">{item.itemName}</span>
                            <span className="mx-2 text-[#05E2F2]">•</span>
                            <span className="text-[#05E2F2]/70">Qty: {item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center bg-[#05E2F2]/5 rounded-lg p-3">
                        <svg className="w-5 h-5 text-[#05E2F2] mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold text-2xl text-[#05E2F2]">${order.ironingPrice.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-[#05E2F2]/10 p-2 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-[#05E2F2]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(order.pickupTime).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#05E2F2]/70">
                            {new Date(order.pickupTime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              second: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center ${getStatusColor(order.status)}`}>
                          <StatusIcon status={order.status} />
                          <span className="ml-2 capitalize">{order.status}</span>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="ml-2 px-3 py-1 rounded-lg border border-[#05E2F2]/30 bg-white text-[#05E2F2] text-sm focus:ring-2 focus:ring-[#05E2F2]/50 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-3 bg-[#05E2F2]/10 hover:bg-[#05E2F2]/20 text-[#05E2F2] rounded-xl transition-colors"
                        title="Delete order"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - This remains exactly as you had it */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#05E2F2]/20">
            <div className="px-6 py-4 border-b border-[#05E2F2]/10 flex items-center justify-between bg-gradient-to-r from-[#05E2F2]/5 to-white">
              <div>
                <h3 className="text-2xl font-bold text-[#05E2F2]">Create New Order</h3>
                <p className="text-[#05E2F2]/70 text-sm mt-1">Fill in the order details below</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-[#05E2F2]/10 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-[#05E2F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#05E2F2] mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Select Customer
                  </label>
                  <select
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#05E2F2]/30 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-transparent outline-none transition-all"
                  >
                    <option value="" className="text-gray-400">Choose a customer...</option>
                    {customers.map(c => (
                      <option key={c._id} value={c._id} className="text-gray-900">{c.fullName}</option>
                    ))}
                  </select>
                </div>

                {/* Items Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-[#05E2F2] flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                      Order Items
                    </label>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="flex items-center gap-2 text-[#05E2F2] hover:text-[#05E2F2]/80 font-medium bg-[#05E2F2]/10 hover:bg-[#05E2F2]/20 px-4 py-2 rounded-xl transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-[#05E2F2]/5 rounded-xl border border-[#05E2F2]/20">
                        <div className="flex-1">
                          <select
                            value={item.itemName}
                            onChange={(e) => handleChange(e, idx, "itemName")}
                            required
                            className="w-full px-4 py-2 border border-[#05E2F2]/30 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-transparent outline-none"
                          >
                            <option value="" className="text-gray-400">Select item...</option>
                            {itemsList.map(i => (
                              <option key={i._id} value={i.name} className="text-gray-900">{i.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            value={item.qty}
                            min="1"
                            onChange={(e) => handleChange(e, idx, "qty")}
                            required
                            className="w-full px-4 py-2 border border-[#05E2F2]/30 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-transparent outline-none"
                            placeholder="Qty"
                          />
                        </div>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(idx)}
                            className="p-2 text-[#05E2F2] hover:bg-[#05E2F2]/10 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-gradient-to-r from-[#05E2F2]/10 to-[#05E2F2]/5 p-6 rounded-xl border border-[#05E2F2]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-[#05E2F2] p-3 rounded-xl mr-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-[#05E2F2]/70">Total Ironing Price</p>
                        <p className="text-4xl font-bold text-[#05E2F2]">${formData.ironingPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#05E2F2]/70">Price per item</p>
                      <p className="text-lg font-semibold text-[#05E2F2]">$0.50</p>
                    </div>
                  </div>
                </div>

                {/* Pickup Time */}
                <div>
                  <label className="block text-sm font-medium text-[#05E2F2] mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Pickup Time
                  </label>
                  <input
                    type="datetime-local"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#05E2F2]/30 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[#05E2F2]/50 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-[#05E2F2]/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 text-[#05E2F2] hover:bg-[#05E2F2]/10 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#05E2F2] hover:bg-[#05E2F2]/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ironing;
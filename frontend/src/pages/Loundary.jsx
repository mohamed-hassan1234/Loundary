import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

// API base URL variable
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL= "https://sidra.somsoftsystems.com/api";

const Laundry = () => {
  const [customers, setCustomers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    status: "all",
    dateRange: "all"
  });

  // Create Order State
  const [order, setOrder] = useState({
    customer: "",
    pickupTime: "",
    items: [{ itemName: "", qty: "" }],
  });

  // Edit Order State
  const [editingOrder, setEditingOrder] = useState(null);

  // Status colors using only #05E2F2
  const statusColors = {
    'Pending': 'bg-[#05E2F2]/20 text-[#05E2F2]',
    'In-Progress': 'bg-[#05E2F2]/30 text-[#05E2F2]',
    'Completed': 'bg-[#05E2F2]/40 text-[#05E2F2]',
    'Delivered': 'bg-[#05E2F2]/50 text-[#05E2F2]'
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

  // Fetch data
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/laundry`);
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [customersRes, itemsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/customers`),
          axios.get(`${API_BASE_URL}/items`)
        ]);
        setCustomers(customersRes.data);
        setItemsList(itemsRes.data);
        await fetchOrders();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filtered orders based on search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search term matching
      const matchesSearch = searchTerm === "" || 
        order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus = searchFilters.status === "all" || 
        order.status === searchFilters.status;

      // Date range filter
      let matchesDateRange = true;
      if (searchFilters.dateRange !== "all") {
        const orderDate = new Date(order.registerDate || order.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        switch(searchFilters.dateRange) {
          case "today":
            matchesDateRange = diffDays === 0;
            break;
          case "week":
            matchesDateRange = diffDays <= 7;
            break;
          case "month":
            matchesDateRange = diffDays <= 30;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [orders, searchTerm, searchFilters]);

  // Add row
  const addItemRow = (stateSetter, currentState) => {
    stateSetter({
      ...currentState,
      items: [...currentState.items, { itemName: "", qty: "" }],
    });
  };

  // Update row
  const updateItemField = (index, field, value, setter, data) => {
    const updated = [...data.items];
    updated[index][field] = value;
    setter({ ...data, items: updated });
  };

  // Remove row
  const removeItemRow = (index, setter, data) => {
    if (data.items.length <= 1) return;
    const updated = data.items.filter((_, i) => i !== index);
    setter({ ...data, items: updated });
  };

  // Submit Create Order
  const submitOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/laundry`, order);
      setOrder({ customer: "", pickupTime: "", items: [{ itemName: "", qty: "" }] });
      fetchOrders();
    } catch {
      alert("Error creating order");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Edit Order
  const submitUpdate = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/laundry/${editingOrder._id}`,
        editingOrder
      );
      setEditingOrder(null);
      fetchOrders();
    } catch {
      alert("Error updating");
    } finally {
      setIsLoading(false);
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    await axios.put(`${API_BASE_URL}/laundry/${id}/status`, { status });
    fetchOrders();
  };

  // Delete Order
  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await axios.delete(`${API_BASE_URL}/laundry/${id}`);
      fetchOrders();
    }
  };

  // Clear Search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchFilters({
      status: "all",
      dateRange: "all"
    });
  };

  // Custom SVG Icons (existing icons remain the same, adding Search icon)
  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  );

  const FilterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  // ... (All your existing icons remain here - PlusIcon, UserIcon, CalendarIcon, etc.)
  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  );

  const PackageIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  );

  const DollarIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  const SaveIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05E2F2]/5 to-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#05E2F2]">
            Laundry Management
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-[#05E2F2] flex items-center justify-center">
              <PackageIcon />
            </div>
            <span className="text-[#05E2F2]/70 font-medium">Admin Panel</span>
          </div>
        </div>
        <p className="text-[#05E2F2]/70">Manage your laundry orders efficiently</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Create Order */}
        <div className="lg:col-span-2">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-[#05E2F2]/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#05E2F2]/10 flex items-center justify-center mr-4">
                <SearchIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#05E2F2]">Search Orders</h2>
                <p className="text-[#05E2F2]/70">Find specific orders quickly</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-12 p-4 border border-[#05E2F2]/30 rounded-xl focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200 bg-white"
                placeholder="Search by customer name, order ID, or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm("")}
                >
                  <XIcon />
                </button>
              )}
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="flex items-center text-[#05E2F2] font-medium">
                  <FilterIcon />
                  <span className="ml-2">Status</span>
                </label>
                <select
                  className="w-full p-3 border border-[#05E2F2]/30 rounded-lg focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200"
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters({...searchFilters, status: e.target.value})}
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="flex items-center text-[#05E2F2] font-medium">
                  <CalendarIcon />
                  <span className="ml-2">Date Range</span>
                </label>
                <select
                  className="w-full p-3 border border-[#05E2F2]/30 rounded-lg focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200"
                  value={searchFilters.dateRange}
                  onChange={(e) => setSearchFilters({...searchFilters, dateRange: e.target.value})}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              {/* Results and Clear */}
              <div className="space-y-2">
                <label className="text-[#05E2F2] font-medium">Results</label>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-[#05E2F2]/10 rounded-lg">
                    <span className="text-[#05E2F2] font-bold">{filteredOrders.length}</span>
                    <span className="text-[#05E2F2]/70 ml-2">orders found</span>
                  </div>
                  {(searchTerm || searchFilters.status !== "all" || searchFilters.dateRange !== "all") && (
                    <button
                      onClick={clearSearch}
                      className="p-3 text-[#05E2F2] hover:bg-[#05E2F2]/10 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <XIcon />
                      <span className="ml-1">Clear</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Create Order Card (existing code remains the same) */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-[#05E2F2]/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 flex items-center justify-center mr-4">
                <PlusIcon />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#05E2F2]">Create New Order</h2>
                <p className="text-[#05E2F2]/70">Add a new laundry order</p>
              </div>
            </div>

            <form onSubmit={submitOrder} className="space-y-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-[#05E2F2] font-medium">
                  <UserIcon />
                  <span className="ml-2">Customer</span>
                </label>
                <select
                  className="w-full p-3 border border-[#05E2F2]/30 rounded-xl focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  value={order.customer}
                  onChange={(e) => setOrder({ ...order, customer: e.target.value })}
                  required
                >
                  <option value="" className="text-gray-400">Select a customer...</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id} className="text-gray-700">
                      {c.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Time */}
              <div className="space-y-2">
                <label className="flex items-center text-[#05E2F2] font-medium">
                  <CalendarIcon />
                  <span className="ml-2">Pickup Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-[#05E2F2]/30 rounded-xl focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200"
                  value={order.pickupTime}
                  onChange={(e) => setOrder({ ...order, pickupTime: e.target.value })}
                  required
                />
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-[#05E2F2] font-medium">
                    <PackageIcon />
                    <span className="ml-2">Order Items</span>
                  </label>
                  <span className="text-sm text-[#05E2F2]/70">{order.items.length} item(s)</span>
                </div>

                {order.items.map((row, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-[#05E2F2]/5 p-4 rounded-xl border border-[#05E2F2]/20">
                    <div className="md:col-span-6">
                      <select
                        className="w-full p-3 border border-[#05E2F2]/30 rounded-lg focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200"
                        value={row.itemName}
                        onChange={(e) =>
                          updateItemField(index, "itemName", e.target.value, setOrder, order)
                        }
                        required
                      >
                        <option value="" className="text-gray-400">Select an item...</option>
                        {itemsList.map((item) => (
                          <option key={item._id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-4">
                      <input
                        type="number"
                        placeholder="Quantity"
                        className="w-full p-3 border border-[#05E2F2]/30 rounded-lg focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200"
                        value={row.qty}
                        onChange={(e) =>
                          updateItemField(index, "qty", e.target.value, setOrder, order)
                        }
                        min="1"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      {order.items.length > 1 && (
                        <button
                          type="button"
                          className="p-2 text-[#05E2F2] hover:bg-[#05E2F2]/10 rounded-lg transition-colors duration-200"
                          onClick={() => removeItemRow(index, setOrder, order)}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="flex items-center justify-center w-full p-3 border-2 border-dashed border-[#05E2F2]/30 rounded-xl text-[#05E2F2] hover:border-[#05E2F2] hover:text-[#05E2F2] transition-all duration-200 hover:bg-[#05E2F2]/5"
                  onClick={() => addItemRow(setOrder, order)}
                >
                  <PlusIcon />
                  <span className="ml-2">Add Another Item</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-4 bg-[#05E2F2] text-white font-semibold rounded-xl hover:bg-[#05E2F2]/90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Order...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircleIcon />
                    <span className="ml-2">Create Order</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Orders List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-[#05E2F2] flex items-center justify-center mr-4">
                  <MenuIcon />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#05E2F2]">All Orders</h2>
                  <p className="text-[#05E2F2]/70">
                    Showing {filteredOrders.length} of {orders.length} order(s)
                  </p>
                </div>
              </div>
              {filteredOrders.length !== orders.length && (
                <button
                  onClick={clearSearch}
                  className="flex items-center px-4 py-2 text-[#05E2F2] hover:bg-[#05E2F2]/10 rounded-lg transition-colors duration-200"
                >
                  <XIcon />
                  <span className="ml-2">Clear Search</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#05E2F2]"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#05E2F2]/10 flex items-center justify-center">
                  <SearchIcon />
                </div>
                <h3 className="text-xl font-bold text-[#05E2F2] mb-2">No orders found</h3>
                <p className="text-[#05E2F2]/70">
                  {searchTerm ? `No orders matching "${searchTerm}"` : "No orders match your filters"}
                </p>
                {(searchTerm || searchFilters.status !== "all" || searchFilters.dateRange !== "all") && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-6 py-2 bg-[#05E2F2] text-white rounded-lg hover:bg-[#05E2F2]/90 transition-colors duration-200"
                  >
                    Clear Search & Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((o) => (
                  <div key={o._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-[#05E2F2]/20">
                    <div className="p-5">
                      {/* Header with Creation Time */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-[#05E2F2]">
                            Order #{o._id.slice(-6)}
                          </h3>
                          <div className="flex items-center mt-1">
                            <UserIcon />
                            <span className="ml-1 font-medium text-[#05E2F2]/80">{o.customer?.fullName}</span>
                          </div>
                          {/* Creation Time Display */}
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-[#05E2F2]/60">
                              <span className="font-medium">Created:</span> {formatDateTimeWithSeconds(o.registerDate || o.createdAt)}
                            </p>
                            <p className="text-xs text-[#05E2F2]/50">
                              {getRelativeTime(o.registerDate || o.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[o.status]}`}>
                          {o.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <ClockIcon />
                          <div className="ml-2">
                            <p className="text-sm text-[#05E2F2]/70">Pickup</p>
                            <p className="text-sm font-medium text-[#05E2F2]">
                              {new Date(o.pickupTime).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-[#05E2F2]/60">
                              {new Date(o.pickupTime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                second: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <DollarIcon />
                          <div className="ml-2">
                            <p className="text-sm text-[#05E2F2]/70">Total</p>
                            <p className="text-lg font-bold text-[#05E2F2]">${o.totalPayment}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-[#05E2F2] mb-2">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {o.items.map((i, index) => (
                            <span key={index} className="px-3 py-1 bg-[#05E2F2]/10 rounded-lg text-sm text-[#05E2F2]">
                              {i.itemName} × {i.qty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <select
                        className="w-full p-2 border border-[#05E2F2]/30 rounded-lg mb-4 focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200 text-[#05E2F2]"
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>In-Progress</option>
                        <option>Completed</option>
                        <option>Delivered</option>
                      </select>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-[#05E2F2] text-white rounded-lg hover:bg-[#05E2F2]/90 hover:shadow-md transition-all duration-200"
                          onClick={() => setEditingOrder(o)}
                        >
                          <EditIcon />
                          Edit
                        </button>
                        <button
                          className="flex-1 flex items-center justify-center gap-2 p-2 bg-[#05E2F2]/10 text-[#05E2F2] rounded-lg hover:bg-[#05E2F2]/20 hover:shadow-md transition-all duration-200"
                          onClick={() => deleteOrder(o._id)}
                        >
                          <TrashIcon />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats (existing code remains the same) */}
        <div className="lg:col-span-1">
          {/* Stats Card */}
          <div className="bg-[#05E2F2] rounded-2xl shadow-xl p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-6">Overview</h3>
            <div className="space-y-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <p className="text-sm opacity-90">Total Orders</p>
                <p className="text-3xl font-bold">{orders.length}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <p className="text-sm opacity-90">Active Customers</p>
                <p className="text-3xl font-bold">{customers.length}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <p className="text-sm opacity-90">Available Items</p>
                <p className="text-3xl font-bold">{itemsList.length}</p>
              </div>
            </div>
          </div>

          {/* Quick Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#05E2F2]/20">
            <h3 className="text-lg font-bold text-[#05E2F2] mb-4">Order Status</h3>
            <div className="space-y-3">
              {Object.entries(statusColors).map(([status, colorClass]) => {
                const count = orders.filter(o => o.status === status).length;
                return (
                  <div key={status} className="flex items-center justify-between p-3 hover:bg-[#05E2F2]/5 rounded-lg transition-colors duration-200">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 bg-[#05E2F2] ${colorClass.includes('20') ? 'opacity-20' : colorClass.includes('30') ? 'opacity-30' : colorClass.includes('40') ? 'opacity-40' : 'opacity-50'}`}></div>
                      <span className="text-[#05E2F2]">{status}</span>
                    </div>
                    <span className="font-bold text-[#05E2F2]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-[#05E2F2]/20">
            <h3 className="text-lg font-bold text-[#05E2F2] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {orders.slice(0, 3).map((o) => (
                <div key={o._id} className="flex items-center p-3 hover:bg-[#05E2F2]/5 rounded-lg transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-[#05E2F2]/10 flex items-center justify-center mr-3">
                    <PackageIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#05E2F2]">{o.customer?.fullName}</p>
                    <p className="text-sm text-[#05E2F2]/70">
                      ${o.totalPayment} • {o.items.length} item(s)
                    </p>
                    <p className="text-xs text-[#05E2F2]/50">
                      {getRelativeTime(o.registerDate || o.createdAt)}
                    </p>
                  </div>
                  <ChevronRightIcon />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal (existing code remains the same) */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#05E2F2]/20">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#05E2F2]/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#05E2F2] flex items-center justify-center mr-3">
                    <EditIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#05E2F2]">Edit Order</h2>
                    <p className="text-sm text-[#05E2F2]/70">Order #{editingOrder._id?.slice(-6)}</p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-[#05E2F2]/10 rounded-lg transition-colors duration-200"
                  onClick={() => setEditingOrder(null)}
                >
                  <XIcon />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Edit Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {editingOrder.items.map((row, index) => (
                  <div key={index} className="bg-[#05E2F2]/5 p-4 rounded-xl border border-[#05E2F2]/20">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="col-span-2">
                        <select
                          className="w-full p-3 border border-[#05E2F2]/30 rounded-lg focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200"
                          value={row.itemName}
                          onChange={(e) =>
                            updateItemField(index, "itemName", e.target.value, setEditingOrder, editingOrder)
                          }
                        >
                          {itemsList.map((item) => (
                            <option key={item._id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Quantity"
                          className="w-full p-3 border border-[#05E2F2]/30 rounded-lg focus:ring-2 focus:ring-[#05E2F2] focus:border-transparent transition-all duration-200"
                          value={row.qty}
                          onChange={(e) =>
                            updateItemField(index, "qty", e.target.value, setEditingOrder, editingOrder)
                          }
                          min="1"
                        />
                      </div>
                      <div className="flex items-center justify-end">
                        {editingOrder.items.length > 1 && (
                          <button
                            className="p-2 text-[#05E2F2] hover:bg-[#05E2F2]/10 rounded-lg transition-colors duration-200"
                            onClick={() => removeItemRow(index, setEditingOrder, editingOrder)}
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item Button */}
              <button
                className="w-full flex items-center justify-center p-3 border-2 border-dashed border-[#05E2F2]/30 rounded-xl text-[#05E2F2] hover:border-[#05E2F2] hover:text-[#05E2F2] transition-all duration-200 mt-4"
                onClick={() => addItemRow(setEditingOrder, editingOrder)}
              >
                <PlusIcon />
                <span className="ml-2">Add Another Item</span>
              </button>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#05E2F2] text-white font-semibold rounded-xl hover:bg-[#05E2F2]/90 hover:shadow-lg transition-all duration-200"
                  onClick={submitUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <SaveIcon />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  className="flex-1 p-3 border border-[#05E2F2]/30 text-[#05E2F2] font-semibold rounded-xl hover:bg-[#05E2F2]/5 transition-all duration-200"
                  onClick={() => setEditingOrder(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laundry;
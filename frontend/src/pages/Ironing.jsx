import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const Ironing = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Print State
  const [printData, setPrintData] = useState(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const [formData, setFormData] = useState({
    customer: "",
    items: [{ itemName: "", qty: 1 }],
    ironingPrice: 0,
    pickupTime: "",
  });

  // const API_ORDERS = "http://localhost:5000/api/ironing";
  // const API_CUSTOMERS = "http://localhost:5000/api/customers";
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

  // --- Print Functions ---
  const handlePrint = (orderData) => {
    setPrintData(orderData);
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
      const printContent = document.getElementById('print-ironing-receipt-content');
      
      if (printContent) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Print Ironing Receipt</title>
            <style>
              @page {
                margin: 20mm;
                size: A4;
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
              }
              .print-container {
                max-width: 210mm;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 25px;
                background: white;
              }
              .company-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #05E2F2;
                padding-bottom: 20px;
              }
              .company-header h1 {
                color: #05E2F2;
                margin: 10px 0;
                font-size: 28px;
              }
              .receipt-title {
                text-align: center;
                background: #05E2F2;
                color: white;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                font-size: 20px;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 25px 0;
              }
              .info-box {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #05E2F2;
              }
              .info-box h3 {
                color: #05E2F2;
                margin-top: 0;
                border-bottom: 1px solid #ddd;
                padding-bottom: 8px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 25px 0;
                font-size: 14px;
              }
              th {
                background: #05E2F2;
                color: white;
                text-align: left;
                padding: 12px;
                font-weight: bold;
              }
              td {
                padding: 10px 12px;
                border-bottom: 1px solid #ddd;
              }
              tr:nth-child(even) {
                background: #f9f9f9;
              }
              .total-row {
                font-weight: bold;
                background: #f0f9ff;
                font-size: 16px;
              }
              .total-amount {
                color: #05E2F2;
                font-weight: bold;
              }
              .signature-area {
                display: flex;
                justify-content: space-between;
                margin-top: 50px;
                padding-top: 30px;
                border-top: 1px solid #333;
              }
              .signature-box {
                text-align: center;
                width: 30%;
              }
              .signature-line {
                border-bottom: 1px solid #333;
                height: 40px;
                margin-bottom: 10px;
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                .print-container {
                  padding: 15px;
                  border: none;
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

  // --- Form handling ---
  const handleChange = (e, index = null, field = null) => {
    if (index !== null && field !== null) {
      const newItems = [...formData.items];
      newItems[index][field] = field === "qty" ? Number(e.target.value) : e.target.value;
      // Calculate ironingPrice automatically (assuming $0.5 per item)
      const total = newItems.reduce((acc, it) => acc + it.qty * 0.25, 0);
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
    const total = newItems.reduce((acc, it) => acc + it.qty * 0.25, 0);
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
    if (!dateString) return "Not Available";
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

  // Format date for print
  const formatDateForPrint = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for print
  const formatTimeForPrint = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return "Unknown time";
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

  // Print Component
  const PrintReceipt = ({ data }) => {
    if (!data) return null;

    return (
      <div id="print-ironing-receipt-content" style={{ display: 'none' }}>
        <div className="print-container">
          {/* Company Header */}
          <div className="company-header">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Laundry Service Pro</h1>
                <p className="text-gray-600 mb-1">Sidra Loundary</p>
                <p className="text-gray-600 mb-1">Dayniile ,MOGADISHO</p>
                <p className="text-gray-600 font-semibold text-lg">Phone: 0610116628</p>
          </div>

          {/* Receipt Title */}
          <div className="receipt-title">
            IRONING SERVICE RECEIPT
          </div>

          {/* Order Information */}
          <div className="info-grid">
            {/* Customer Information */}
            <div className="info-box">
              <h3>CUSTOMER INFORMATION</h3>
              <p><strong>Customer Name:</strong> {data.customer?.fullName || "Not Available"}</p>
              {/* <p><strong>Customer ID:</strong> {data.customer?._id || "N/A"}</p>
              <p><strong>Order ID:</strong> {data._id || "N/A"}</p> */}
              <p><strong>Order Date:</strong> {formatDateForPrint(data.registerDate)}</p>
              <p><strong>Order Time:</strong> {formatTimeForPrint(data.registerDate)}</p>
            </div>

            {/* Order Details */}
            <div className="info-box">
              <h3>ORDER INFORMATION</h3>
              <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{data.status || "N/A"}</span></p>
              <p><strong>Pickup Date:</strong> {formatDateForPrint(data.pickupTime)}</p>
              <p><strong>Pickup Time:</strong> {formatTimeForPrint(data.pickupTime)}</p>
              <p><strong>Total Items:</strong> {data.items?.length || 0}</p>
              {/* <p><strong>Unit Price:</strong> $0.50 per item</p> */}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 style={{ color: '#05E2F2', marginBottom: '15px', borderBottom: '2px solid #05E2F2', paddingBottom: '8px' }}>
              IRONING ITEMS DETAILS
            </h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ITEM NAME</th>
                  <th>QUANTITY</th>
                  {/* <th>UNIT PRICE</th> */}
                  {/* <th>SUBTOTAL</th> */}
                </tr>
              </thead>
              <tbody>
                {data.items && data.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>{item.itemName || "N/A"}</td>
                    <td style={{ textAlign: 'center' }}>{item.qty || "1"}</td>
                    {/* <td style={{ textAlign: 'center' }}>$0.50</td> */}
                    {/* <td style={{ textAlign: 'center' }}>${((item.qty || 1) * 0.5).toFixed(2)}</td> */}
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="total-row">
                  <td colSpan="4" style={{ textAlign: 'right', paddingRight: '20px' }}>
                    TOTAL AMOUNT:
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '18px', color: '#05E2F2', fontWeight: 'bold' }}>
                    ${data.ironingPrice?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms and Conditions */}
          {/* <div style={{ marginTop: '30px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #05E2F2' }}>
            <h4 style={{ color: '#05E2F2', marginTop: '0' }}>TERMS & CONDITIONS</h4>
            <ul style={{ fontSize: '12px', margin: '0', paddingLeft: '20px' }}>
              <li>Items must be picked up within 3 days of notification</li>
              <li>Professional ironing services for all fabric types</li>
              <li>Payment is due upon pickup of items</li>
              <li>Claims must be made within 12 hours of pickup</li>
            </ul>
          </div> */}
          
          {/* Signature Area */}
          {/* <div className="signature-area">
            <div className="signature-box">
              <div className="signature-line"></div>
              <p><strong>Customer Signature</strong></p>
              <p style={{ fontSize: '12px' }}>Name: {data.customer?.fullName || ""}</p>
            </div>
            <div className="signature-box">
              <div className="signature-line"></div>
              <p><strong>Authorized Signature</strong></p>
              <p style={{ fontSize: '12px' }}>For Professional Ironing Service</p>
            </div>
            <div className="signature-box">
              <div className="signature-line"></div>
              <p><strong>Date</strong></p>
              <p style={{ fontSize: '12px' }}>{new Date().toLocaleDateString()}</p>
            </div>
          </div> */}

          {/* Footer */}
          {/* <div className="footer">
            <p>This is a computer-generated receipt. No signature is required.</p>
            <p>For any inquiries, please contact us at: <strong>0610116628</strong></p>
            <p>Thank you for choosing our professional ironing service!</p>
            <p style={{ marginTop: '10px', color: '#888' }}>
              Receipt ID: {data._id || "N/A"} | Printed on: {new Date().toLocaleString()}
            </p>
          </div> */}
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Print Preview</h2>
                  <p className="text-white/90">Order #{data._id?.slice(-6) || "N/A"} • {data.customer?.fullName || "No Customer"}</p>
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
              {/* Company Header */}
              <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Laundry Service Pro</h1>
                <p className="text-gray-600 mb-1">Sidra Loundary</p>
                <p className="text-gray-600 mb-1">Dayniile ,MOGADISHO</p>
                <p className="text-gray-600 font-semibold text-lg">Phone: 0610116628</p>
              </div>

              {/* Receipt Title */}
              <div className="bg-[#05E2F2] text-white text-center py-4 rounded-lg mb-8">
                <h2 className="text-2xl font-bold">IRONING SERVICE RECEIPT</h2>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-700 mb-3 text-lg border-b pb-2">CUSTOMER INFORMATION</h3>
                  <div className="space-y-2">
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Customer Name:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{data.customer?.fullName || "Not Available"}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Customer ID:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{data.customer?._id || "N/A"}</span>
                    </p>
                    {/* <p className="mb-2">
                      <span className="font-medium text-gray-700">Order ID:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{data._id || "N/A"}</span>
                    </p> */}
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Order Date:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{formatDateForPrint(data.registerDate)}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Order Time:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{formatTimeForPrint(data.registerDate)}</span>
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-700 mb-3 text-lg border-b pb-2">ORDER INFORMATION</h3>
                  <div className="space-y-2">
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Status:</span> 
                      <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                        {data.status || "N/A"}
                      </span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Pickup Date:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{formatDateForPrint(data.pickupTime)}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Pickup Time:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{formatTimeForPrint(data.pickupTime)}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Total Items:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">{data.items?.length || 0}</span>
                    </p>
                    {/* <p className="mb-2">
                      <span className="font-medium text-gray-700">Unit Price:</span> 
                      <span className="ml-2 text-gray-900 font-semibold">$0.50 per item</span>
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-4 text-lg border-b pb-2">IRONING ITEMS</h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left font-bold text-gray-700">#</th>
                        <th className="p-3 text-left font-bold text-gray-700">Item Name</th>
                        <th className="p-3 text-left font-bold text-gray-700">Quantity</th>
                        <th className="p-3 text-left font-bold text-gray-700">Unit Price</th>
                        <th className="p-3 text-left font-bold text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items && data.items.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-3 border-t border-gray-200 text-center">{index + 1}</td>
                          <td className="p-3 border-t border-gray-200">{item.itemName || "N/A"}</td>
                          <td className="p-3 border-t border-gray-200 text-center">{item.qty || "1"}</td>
                          <td className="p-3 border-t border-gray-200 text-center">$0.25</td>
                          <td className="p-3 border-t border-gray-200 text-center">${((item.qty || 1) * 0.25).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700 text-lg">Total Amount:</span>
                    <span className="text-green-600 font-bold text-2xl">${data.ironingPrice?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-center text-gray-700 font-medium">
                  This receipt will be printed with company information and all ironing order details.
                </p>
                <p className="text-center text-gray-600 text-sm mt-2">
                  Includes: Customer Information, Order Details, Items List, Terms & Conditions, and Signature Area
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
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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

        {/* Orders Table - Updated with Print button */}
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
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePrint(order)}
                            className="p-3 bg-[#05E2F2]/10 hover:bg-[#05E2F2]/20 text-[#05E2F2] rounded-xl transition-colors"
                            title="Print receipt"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="p-3 bg-[#05E2F2]/10 hover:bg-[#05E2F2]/20 text-[#05E2F2] rounded-xl transition-colors"
                            title="Delete order"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
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
                        <p className="text-lg font-semibold text-[#05E2F2]">$0.25</p>
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

        {/* Print Preview Modal */}
        {showPrintPreview && printData && (
          <PrintPreviewModal 
            data={printData} 
            onClose={closePrintModal} 
            onPrint={executePrint}
          />
        )}
      </div>

      {/* Print Receipt Component (for actual printing) - This is always rendered but hidden */}
      {printData && <PrintReceipt data={printData} />}
    </>
  );
};

export default Ironing;
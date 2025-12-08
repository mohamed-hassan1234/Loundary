import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Plus, Trash2, Loader2, X, Check, AlertCircle, Search } from "lucide-react";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // const API_URL = "http://localhost:5000/api/items";
  const API_URL= "https://sidra.somsoftsystems.com/api/items";

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item._id.toLowerCase().includes(term) ||
      item.price.toString().includes(term)
    );
  }, [items, searchTerm]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error("FETCH ITEMS ERROR:", err);
      showNotification("Failed to load items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = () => {
    setFormData({ name: "", price: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(API_URL, {
        name: formData.name,
        price: Number(formData.price)
      });
      fetchItems();
      closeModal();
      showNotification("Item added successfully!", "success");
    } catch (err) {
      console.error("CREATE ITEM ERROR:", err);
      showNotification("Failed to add item", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchItems();
        showNotification("Item deleted successfully!", "success");
      } catch (err) {
        console.error("DELETE ITEM ERROR:", err);
        showNotification("Failed to delete item", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#05E2F2]/5 p-4 md:p-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 animate-slideIn ${
          notification.type === "success" 
            ? "bg-green-100 border-green-400 text-green-700" 
            : "bg-red-100 border-red-400 text-red-700"
        } border px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
          {notification.type === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Product Inventory
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your items with ease and precision
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#05E2F2]/20">
            <div className="text-3xl font-bold text-[#05E2F2] mb-2">{items.length}</div>
            <div className="text-gray-600">Total Items</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#05E2F2]/20">
            <div className="text-3xl font-bold text-[#05E2F2] mb-2">
              ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
            </div>
            <div className="text-gray-600">Total Value</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#05E2F2]/20">
            <div className="text-3xl font-bold text-[#05E2F2] mb-2">
              {items.length > 0 
                ? "$" + (items.reduce((sum, item) => sum + item.price, 0) / items.length).toFixed(2)
                : "$0.00"}
            </div>
            <div className="text-gray-600">Average Price</div>
          </div>
        </div>

        {/* Action Bar with Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-xl font-semibold text-gray-700">
            Product List
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/30 focus:border-[#05E2F2] transition-all duration-200"
                placeholder="Search items..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Add Item Button */}
            <button
              onClick={openModal}
              className="group bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 hover:from-[#04D1E1] hover:to-[#04D1E1]/90 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Item</span>
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4 px-4 py-2 bg-[#05E2F2]/10 rounded-lg inline-block">
            <span className="text-sm text-gray-700">
              Showing {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "
              <span className="font-semibold text-[#05E2F2]">{searchTerm}</span>"
            </span>
          </div>
        )}

        {/* Items Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#05E2F2]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#05E2F2]/10 to-[#05E2F2]/5">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="w-10 h-10 text-[#05E2F2] animate-spin" />
                        <div className="text-gray-600">Loading items...</div>
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-[#05E2F2]/10 flex items-center justify-center">
                          <Search className="w-8 h-8 text-[#05E2F2]" />
                        </div>
                        <div className="text-xl font-medium text-gray-700">
                          {searchTerm ? "No items found" : "No items available"}
                        </div>
                        <div className="text-gray-500">
                          {searchTerm 
                            ? `No items match "${searchTerm}"`
                            : "Get started by adding your first item"}
                        </div>
                        {!searchTerm && (
                          <button
                            onClick={openModal}
                            className="mt-4 text-[#05E2F2] font-semibold hover:text-[#04D1E1] flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Item</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr 
                      key={item._id}
                      className="hover:bg-[#05E2F2]/3 transition-colors duration-200"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#05E2F2]/20 to-white flex items-center justify-center text-[#05E2F2] font-bold">
                            {items.findIndex(i => i._id === item._id) + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-lg">
                              {searchTerm ? (
                                <span>
                                  {item.name.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                                      <span key={i} className="bg-yellow-100 text-yellow-800 px-1 rounded">
                                        {part}
                                      </span>
                                    ) : (
                                      part
                                    )
                                  )}
                                </span>
                              ) : (
                                item.name
                              )}
                            </div>
                            <div className="text-sm text-gray-500">ID: {item._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-2xl font-bold text-gray-800">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">USD</div>
                      </td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="group bg-gradient-to-r from-white to-gray-50 hover:from-red-50 hover:to-red-100 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 shadow-sm hover:shadow"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Showing <span className="font-semibold text-[#05E2F2]">{filteredItems.length}</span> of{" "}
          <span className="font-semibold text-gray-700">{items.length}</span> items • 
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-scaleIn">
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Add New Item</h3>
                  <p className="text-gray-600 mt-1">Fill in the details below</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/30 focus:border-[#05E2F2] transition-all duration-200"
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/30 focus:border-[#05E2F2] transition-all duration-200"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/80 hover:from-[#04D1E1] hover:to-[#04D1E1]/90 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Create Item</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
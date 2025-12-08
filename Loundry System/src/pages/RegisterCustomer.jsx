import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaKey, FaIdBadge, FaEdit, FaTrash, FaPlus, FaSpinner, FaSave, FaTimes } from "react-icons/fa";

// API base URL variable
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL= "https://sidra.somsoftsystems.com/api";

const Cashiers = () => {
  const [cashiers, setCashiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ username: "", password: "", name: "" });
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");

  const fetchCashiers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/auth/cashiers`, { withCredentials: true });
      setCashiers(res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error fetching cashiers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashiers();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = "Username is required";
    if (!form.name.trim()) errors.name = "Name is required";
    if (!editingId && !form.password) errors.password = "Password is required for new cashiers";
    if (form.password && form.password.length < 6 && !editingId) errors.password = "Password must be at least 6 characters";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (editingId) {
        // For editing, use the update endpoint
        await axios.put(`${API_BASE_URL}/auth/cashiers/${editingId}`, form, { withCredentials: true });
        setMessage("Cashier updated successfully");
      } else {
        // For creation, use the register-cashier endpoint
        await axios.post(`${API_BASE_URL}/auth/register-cashier`, form, { withCredentials: true });
        setMessage("Cashier created successfully");
      }
      
      setForm({ username: "", password: "", name: "" });
      setEditingId(null);
      setFormErrors({});
      fetchCashiers();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred");
    }
  };

  const handleEdit = (cashier) => {
    setForm({ username: cashier.username, password: "", name: cashier.name });
    setEditingId(cashier._id);
    setFormErrors({});
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cashier?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/auth/cashiers/${id}`, { withCredentials: true });
      setMessage("Cashier deleted successfully");
      fetchCashiers();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error deleting cashier");
    }
  };

  const resetForm = () => {
    setForm({ username: "", password: "", name: "" });
    setEditingId(null);
    setFormErrors({});
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Cashiers Management
          </h1>
          <p className="text-gray-600">
            Manage your cashier accounts and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {editingId ? (
                    <>
                      <FaEdit className="text-[#05E2F2]" />
                      Edit Cashier
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-[#05E2F2]" />
                      Add New Cashier
                    </>
                  )}
                </h2>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>

              {/* Success/Error Message */}
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaUser className="text-[#05E2F2]" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="example@gmail.com"
                      value={form.username}
                      onChange={(e) => {
                        setForm({ ...form, username: e.target.value });
                        setFormErrors({ ...formErrors, username: "" });
                      }}
                      className={`w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 transition-all duration-300 ${
                        formErrors.username ? "border-red-300" : "border-gray-200"
                      }`}
                      required
                    />
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {formErrors.username && (
                    <p className="text-red-500 text-sm mt-1 ml-1">{formErrors.username}</p>
                  )}
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaIdBadge className="text-[#05E2F2]" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        setFormErrors({ ...formErrors, name: "" });
                      }}
                      className={`w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 transition-all duration-300 ${
                        formErrors.name ? "border-red-300" : "border-gray-200"
                      }`}
                      required
                    />
                    <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1 ml-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaKey className="text-[#05E2F2]" />
                    Password
                    {editingId && (
                      <span className="text-xs text-gray-500 ml-auto">(Leave blank to keep current)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder={editingId ? "Enter new password (optional)" : "Enter password"}
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });
                        setFormErrors({ ...formErrors, password: "" });
                      }}
                      className={`w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05E2F2]/50 transition-all duration-300 ${
                        formErrors.password ? "border-red-300" : "border-gray-200"
                      }`}
                      required={!editingId}
                      minLength={editingId ? 0 : 6}
                    />
                    <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1 ml-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#05E2F2] to-[#05E2F2]/90 text-white font-semibold py-3 px-4 rounded-xl hover:from-[#05E2F2]/90 hover:to-[#05E2F2] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
                >
                  {editingId ? (
                    <>
                      <FaSave />
                      Update Cashier
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Cashier
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Cashiers List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Cashiers List
                  <span className="ml-2 bg-[#05E2F2]/10 text-[#05E2F2] text-sm font-medium px-3 py-1 rounded-full">
                    {cashiers.length} {cashiers.length === 1 ? 'Cashier' : 'Cashiers'}
                  </span>
                </h2>
                <button
                  onClick={fetchCashiers}
                  className="text-sm text-gray-600 hover:text-[#05E2F2] flex items-center gap-1"
                >
                  <FaSpinner className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaSpinner className="text-[#05E2F2] text-4xl animate-spin mb-4" />
                  <p className="text-gray-500">Loading cashiers...</p>
                </div>
              ) : cashiers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#05E2F2]/10 to-[#05E2F2]/5 flex items-center justify-center">
                    <FaUser className="text-4xl text-[#05E2F2]/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Cashiers Found</h3>
                  <p className="text-gray-500 mb-4">Add your first cashier using the form on the left</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#05E2F2]/5 to-[#05E2F2]/10">
                        <th className="text-left p-4 font-semibold text-gray-700 rounded-tl-xl">Username</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Full Name</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Created</th>
                        <th className="text-left p-4 font-semibold text-gray-700 rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cashiers.map((c) => (
                        <tr 
                          key={c._id} 
                          className="hover:bg-gradient-to-r hover:from-white hover:to-[#05E2F2]/5 transition-all duration-200"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05E2F2]/20 to-[#05E2F2]/5 flex items-center justify-center">
                                <FaUser className="text-[#05E2F2]" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{c.username}</div>
                                <div className="text-xs text-gray-500">ID: {c._id.substring(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-800">{c.name}</div>
                            <div className="text-sm text-gray-500">Cashier Account</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(c)}
                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center gap-2"
                              >
                                <FaEdit />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center gap-2"
                              >
                                <FaTrash />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Stats Footer */}
              {!loading && cashiers.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-gradient-to-r from-[#05E2F2]/5 to-transparent">
                      <div className="text-2xl font-bold text-[#05E2F2]">{cashiers.length}</div>
                      <div className="text-sm text-gray-600">Total Cashiers</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gradient-to-r from-[#05E2F2]/5 to-transparent">
                      <div className="text-2xl font-bold text-[#05E2F2]">
                        {editingId ? "Editing" : "Ready"}
                      </div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gradient-to-r from-[#05E2F2]/5 to-transparent">
                      <div className="text-2xl font-bold text-[#05E2F2]">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="text-sm text-gray-600">Last Updated</div>
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

export default Cashiers;
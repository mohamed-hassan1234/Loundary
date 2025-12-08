import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiUserPlus, 
  FiEdit, 
  FiTrash2, 
  FiX, 
  FiCheck, 
  FiUser,
  FiPhone,
  FiLoader,
  FiSearch,
  FiRefreshCw
} from "react-icons/fi";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", phone: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // const API_URL = "http://localhost:5000/api/customers";
  const API_URL= "https://sidra.somsoftsystems.com/api/customers";

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (customer = null) => {
    setCurrentCustomer(customer);
    setFormData(
      customer
        ? { fullName: customer.fullName, phone: customer.phone }
        : { fullName: "", phone: "" }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      if (currentCustomer) {
        await axios.put(`${API_URL}/${currentCustomer._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchCustomers();
      closeModal();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setDeleteLoading(id);
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCustomers();
      } catch (err) {
        console.log(err);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage your customer database with ease</p>
        </div>

        {/* Stats and Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center bg-white rounded-xl shadow-sm p-4">
            <div className="bg-[#05E2F2] bg-opacity-10 p-3 rounded-lg mr-4">
              <FiUser className="text-[#05E2F2] text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#05E2F2] focus:ring-2 focus:ring-[#05E2F2] focus:ring-opacity-30 outline-none transition-all w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Customer Button */}
            <button
              onClick={() => openModal()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#05E2F2] to-[#05E2F2] hover:from-[#04c9d8] hover:to-[#04c9d8] text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FiUserPlus className="text-lg" />
              <span>Add Customer</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchCustomers}
              className="flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-5 py-3 rounded-xl border border-gray-200 hover:border-[#05E2F2] hover:text-[#05E2F2] transition-all duration-300 shadow-sm"
            >
              <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Customer Table Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Customer Directory</h2>
            <p className="text-gray-500 text-sm mt-1">
              {filteredCustomers.length} of {customers.length} customers displayed
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-20">
                      <div className="flex flex-col items-center justify-center">
                        <FiLoader className="text-[#05E2F2] text-3xl animate-spin mb-3" />
                        <p className="text-gray-600">Loading customers...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiUser className="text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500 font-medium text-lg">
                          {searchTerm ? "No matching customers found" : "No customers yet"}
                        </p>
                        <p className="text-gray-400 mt-1">
                          {searchTerm
                            ? "Try a different search term"
                            : "Add your first customer to get started"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => openModal()}
                            className="mt-4 flex items-center gap-2 bg-[#05E2F2] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#04c9d8] transition-colors"
                          >
                            <FiUserPlus />
                            Add Customer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-[#05E2F2] to-[#05E2F2] bg-opacity-10 rounded-xl flex items-center justify-center">
                            <FiUser className="text-[#05E2F2] text-xl" />
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-800">{customer.fullName}</p>
                            <p className="text-gray-500 text-sm">Customer ID: {customer._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <FiPhone className="text-gray-400 mr-2" />
                          <span className="font-medium text-gray-700">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => openModal(customer)}
                            className="flex items-center justify-center gap-1 bg-white text-gray-700 border border-gray-300 hover:border-[#05E2F2] hover:text-[#05E2F2] font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm"
                          >
                            <FiEdit />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            disabled={deleteLoading === customer._id}
                            className="flex items-center justify-center gap-1 bg-white text-red-600 border border-red-200 hover:border-red-500 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm disabled:opacity-70"
                          >
                            {deleteLoading === customer._id ? (
                              <FiLoader className="animate-spin" />
                            ) : (
                              <FiTrash2 />
                            )}
                            <span>Delete</span>
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideUp">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {currentCustomer ? "Edit Customer" : "Add New Customer"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {currentCustomer
                      ? "Update customer information"
                      : "Fill in the details to add a new customer"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#05E2F2] focus:ring-2 focus:ring-[#05E2F2] focus:ring-opacity-30 outline-none transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#05E2F2] focus:ring-2 focus:ring-[#05E2F2] focus:ring-opacity-30 outline-none transition-all"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-3 mt-8 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#05E2F2] to-[#05E2F2] hover:from-[#04c9d8] hover:to-[#04c9d8] text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  >
                    {submitLoading ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiCheck className="text-lg" />
                    )}
                    <span>{currentCustomer ? "Update Customer" : "Add Customer"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Customer;
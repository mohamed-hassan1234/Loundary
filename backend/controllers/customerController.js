const Customer = require("../models/Customer");

// CREATE Customer
exports.createCustomer = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ error: "Full Name and Phone are required" });
    }

    const customer = await Customer.create({ fullName, phone });
    res.status(201).json(customer);
  } catch (error) {
    console.error("CREATE CUSTOMER ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// READ All Customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ registerDate: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ Single Customer
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE Customer
exports.updateCustomer = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { fullName, phone },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const User = require("../models/User");
const bcrypt = require("bcryptjs");

// --- List all cashiers ---
exports.getCashiers = async (req, res) => {
  try {
    const cashiers = await User.find({ role: "cashier" }).select("-password");
    res.json(cashiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Register a cashier (admin only) ---
exports.createCashier = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const cashier = new User({ username, password: hashedPassword, name, role: "cashier" });
    await cashier.save();

    res.json({ message: "Cashier created", cashier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Update cashier ---
exports.updateCashier = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, name } = req.body;

    const cashier = await User.findById(id);
    if (!cashier || cashier.role !== "cashier")
      return res.status(404).json({ error: "Cashier not found" });

    if (username) cashier.username = username;
    if (name) cashier.name = name;
    if (password) cashier.password = await bcrypt.hash(password, 10);

    await cashier.save();
    res.json({ message: "Cashier updated", cashier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Delete cashier ---
exports.deleteCashier = async (req, res) => {
  try {
    const { id } = req.params;

    const cashier = await User.findById(id);
    if (!cashier || cashier.role !== "cashier")
      return res.status(404).json({ error: "Cashier not found" });

    await cashier.remove();
    res.json({ message: "Cashier deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  registerDate: { type: Date, default: Date.now }
});

// Auto-generate Customer ID without using `next` problem
customerSchema.pre("save", function() {
  if (!this.customerId) {
    this.customerId = "CUST-" + Math.floor(10000 + Math.random() * 90000);
  }
});

module.exports = mongoose.model("Customer", customerSchema);

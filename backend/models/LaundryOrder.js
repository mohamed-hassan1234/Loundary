const mongoose = require("mongoose");

const laundryOrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  items: [
    {
      itemName: String,
      qty: Number
    }
  ],

  pickupTime: { type: Date, required: true },
  totalPayment: Number,

  status: {
    type: String,
    enum: ["Pending", "In-Progress", "Completed", "Delivered"],
    default: "Pending"
  },

  registerDate: { type: Date, default: Date.now },
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LaundryOrder", laundryOrderSchema);

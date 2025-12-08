// models/IroningOrder.js
const mongoose = require('mongoose');

const ironingOrderSchema = new mongoose.Schema({
  
  // Customer Info
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },

  // Dharka loo feerayo
  items: [
    {
      itemName: { type: String, required: true },
      qty: { type: Number, required: true }
    }
  ],

  // Total ironing price
  ironingPrice: { type: Number, default: 0 }, // system calculated

  // Pickup time
  pickupTime: Date,

  // Auto creation date
  registerDate: { type: Date, default: Date.now },

  // Cashier
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Status
  status: {
    type: String,
    enum: ['pending', 'ready', 'delivered'],
    default: 'pending'
  }
});

module.exports = mongoose.model('IroningOrder', ironingOrderSchema);

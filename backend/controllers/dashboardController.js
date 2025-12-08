const Customer = require("../models/Customer");
const IroningOrder = require("../models/IroningOrder");
const LaundryOrder = require("../models/LaundryOrder");
const Item = require("../models/Item");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res) => {
  try {
    // --- Total customers ---
    const totalCustomers = await Customer.countDocuments();

    // --- Total ironing revenue ---
    const ironingRevenueAgg = await IroningOrder.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$ironingPrice" } } }
    ]);
    const totalIroningRevenue = ironingRevenueAgg[0]?.totalRevenue || 0;

    // --- Total laundry revenue ---
    const laundryRevenueAgg = await LaundryOrder.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPayment" } } }
    ]);
    const totalLaundryRevenue = laundryRevenueAgg[0]?.totalRevenue || 0;

    // --- Items count and revenue (ironing) ---
    const ironingItemsAgg = await IroningOrder.aggregate([
      { $unwind: "$items" },
      { $group: { 
          _id: "$items.itemName",
          totalQty: { $sum: "$items.qty" },
          totalRevenue: { $sum: { $multiply: ["$items.qty", 0.5] } } 
      }},
      { $sort: { totalQty: -1 } }
    ]);

    // --- Items count and revenue (laundry) ---
    const laundryItemsAgg = await LaundryOrder.aggregate([
      { $unwind: "$items" },
      { $group: { 
          _id: "$items.itemName",
          totalQty: { $sum: "$items.qty" },
          // For laundry, price may be from item price collection
          totalRevenue: { $sum: "$items.qty" } 
      }},
      { $sort: { totalQty: -1 } }
    ]);

    // --- Most common order status ---
    const ironingStatusAgg = await IroningOrder.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const laundryStatusAgg = await LaundryOrder.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalCustomers,
      totalIroningRevenue,
      totalLaundryRevenue,
      ironingItemsAgg,
      laundryItemsAgg,
      ironingStatusAgg,
      laundryStatusAgg
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

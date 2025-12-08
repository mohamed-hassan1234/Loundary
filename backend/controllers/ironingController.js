const IroningOrder = require("../models/IroningOrder");
const Customer = require("../models/Customer"); // Assuming Customer model exists

// --- Calculate Total ---
function calculateTotal(items) {
  let total = 0;
  for (const it of items) {
    total += it.qty * 0.5; // automatic price calculation per item
  }
  return total;
}

// --- CREATE ORDER ---
// controllers/ironingController.js

exports.createIroningOrder = async (req, res) => {
  try {
    const { customer, items, pickupTime } = req.body;

    const ironingPrice = items.reduce((acc, it) => acc + it.qty * 0.5, 0);

    const order = await IroningOrder.create({
      customer,
      items,
      pickupTime,
      ironingPrice,
      status: "pending",
      registerDate: new Date(),
      createdBy: req.user?.id || "64f8a2d1c1234abcd567ef99" // <-- dummy user id
    });

    const populated = await order.populate("customer");
    res.json(populated);
  } catch (e) {
    console.error(e); // Log the real error
    res.status(500).json({ error: e.message });
  }
};


// --- GET ALL ORDERS ---
exports.getIroningOrders = async (req, res) => {
  try {
    const orders = await IroningOrder.find().populate("customer").populate("createdBy");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- UPDATE FULL ORDER ---
exports.updateIroningOrder = async (req, res) => {
  try {
    const { customer, items, pickupTime } = req.body;

    const order = await IroningOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const newItems = items || order.items;
    const newPickupTime = pickupTime || order.pickupTime;
    const newCustomer = customer || order.customer;

    order.items = newItems;
    order.pickupTime = newPickupTime;
    order.customer = newCustomer;
    order.ironingPrice = calculateTotal(newItems);

    await order.save();
    const populated = await order.populate("customer");
    res.json(populated);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- UPDATE STATUS ONLY ---
exports.updateIroningStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await IroningOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- DELETE ORDER ---
exports.deleteIroningOrder = async (req, res) => {
  try {
    const deleted = await IroningOrder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

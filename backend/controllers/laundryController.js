const LaundryOrder = require("../models/LaundryOrder");
const Item = require("../models/Item");

// --- Calculate total payment based on items ---
async function calculateTotal(items) {
  let total = 0;
  for (const it of items) {
    const dbItem = await Item.findOne({ name: it.itemName });
    if (!dbItem) throw new Error(`Item not found: ${it.itemName}`);
    total += dbItem.price * it.qty;
  }
  return total;
}

// --- CREATE ORDER ---
exports.createLaundryOrder = async (req, res) => {
  try {
    const { customer, items, pickupTime } = req.body;

    const totalPayment = await calculateTotal(items);

    const order = await LaundryOrder.create({
      customer,
      items,
      pickupTime,
      totalPayment,
      status: "Pending"
    });

    const populated = await order.populate("customer");
    res.json(populated);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- GET ALL ORDERS ---
exports.getLaundryOrders = async (req, res) => {
  try {
    const orders = await LaundryOrder.find().populate("customer");
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- UPDATE FULL ORDER (all fields) ---
exports.updateLaundryOrder = async (req, res) => {
  try {
    const { customer, items, pickupTime, status } = req.body;

    // Preserve old data if some fields are missing
    const order = await LaundryOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const newItems = items || order.items;
    const newPickupTime = pickupTime || order.pickupTime;
    const newCustomer = customer || order.customer;
    const newStatus = status || order.status;

    const totalPayment = await calculateTotal(newItems);

    order.items = newItems;
    order.pickupTime = newPickupTime;
    order.customer = newCustomer;
    order.status = newStatus;
    order.totalPayment = totalPayment;

    await order.save();

    const populated = await order.populate("customer");
    res.json(populated);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- UPDATE STATUS ONLY ---
exports.updateLaundryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await LaundryOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- DELETE ORDER ---
exports.deleteLaundryOrder = async (req, res) => {
  try {
    const deleted = await LaundryOrder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

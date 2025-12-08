const router = require("express").Router();
const {
  createLaundryOrder,
  getLaundryOrders,
  deleteLaundryOrder,
  updateLaundryOrder,
  updateLaundryStatus
} = require("../controllers/laundryController");

// --- CRUD ROUTES ---
router.post("/", createLaundryOrder);          // Create order
router.get("/", getLaundryOrders);            // Get all orders
router.put("/:id", updateLaundryOrder);       // Update all fields
router.delete("/:id", deleteLaundryOrder);    // Delete order

// --- UPDATE STATUS ONLY ---
router.put("/:id/status", updateLaundryStatus);

module.exports = router;

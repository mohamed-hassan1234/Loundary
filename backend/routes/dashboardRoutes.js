const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/dashboardController");

// Only admin can access dashboard
router.get("/", protect, adminOnly, getDashboardStats);

module.exports = router;

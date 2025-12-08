const router = require("express").Router();
const { 
  registerAdmin,
  registerCashier,
  getAllCashiers,
  updateCashier,
  deleteCashier,
  login,
  logout,
  deleteAccount,
  updateProfile,
  getProfile,
  getAdminProfile,
  updateAdminProfile
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

// Public routes
router.post("/register-admin", registerAdmin);
router.post("/register-cashier", registerCashier);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes (require authentication)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);

// Admin specific routes
router.get("/admin/profile", protect, adminOnly, getAdminProfile);
router.put("/admin/profile", protect, adminOnly, updateAdminProfile); // ADDED protect HERE

// Cashier management (admin only)
router.get("/cashiers", protect, adminOnly, getAllCashiers);
router.put("/cashiers/:id", protect, adminOnly, updateCashier);
router.delete("/cashiers/:id", protect, adminOnly, deleteCashier);

module.exports = router;
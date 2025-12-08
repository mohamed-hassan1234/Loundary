const router = require("express").Router();
const {
  getCashiers,
  createCashier,
  updateCashier,
  deleteCashier
} = require("../controllers/cashierController");

const { protect, adminOnly } = require("../middleware/auth");

// All routes are admin protected
router.get("/", protect, adminOnly, getCashiers);
router.post("/", protect, adminOnly, createCashier);
router.put("/:id", protect, adminOnly, updateCashier);
router.delete("/:id", protect, adminOnly, deleteCashier);

module.exports = router;
 
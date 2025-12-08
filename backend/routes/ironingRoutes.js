const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  createIroningOrder,
  getIroningOrders,
  updateIroningOrder,
  updateIroningStatus,
  deleteIroningOrder
} = require("../controllers/ironingController");

router.post("/",  createIroningOrder);
router.get("/",  getIroningOrders);
router.put("/:id",  updateIroningOrder); // full update
router.put("/:id/status",  updateIroningStatus); // status only
router.delete("/:id",  deleteIroningOrder);

module.exports = router;

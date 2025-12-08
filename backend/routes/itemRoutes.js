const router = require("express").Router();
const { createItem, getItems, deleteItem } = require("../controllers/itemController");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:id", deleteItem);

module.exports = router;

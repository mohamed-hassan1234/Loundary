const Item = require("../models/Item");

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// controllers/itemController.js
const Item = require("../models/Item");

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  const items = await Item.find().sort({ name: 1 });
  res.json(items);
};

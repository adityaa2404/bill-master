// controllers/itemController.js
const itemService = require("../services/itemService");

exports.createItem = async (req, res) => {
  try {
    const item = await itemService.createItem(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await itemService.getItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

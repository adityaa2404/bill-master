// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. "One way light point"
  unit: { type: String, default: "Nos" },   // e.g. "Nos", "mtr"
  defaultQty: { type: Number, default: 1 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", itemSchema);

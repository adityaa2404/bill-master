// models/BilledItem.js
const mongoose = require("mongoose");

const billedItemSchema = new mongoose.Schema({
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bill",
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true
  },

  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },
  subsectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subsection",
    default: null   // null = global item directly under section
  },

  description: String, // optional custom text

  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },     // price locked per bill
  amount: { type: Number, required: true },   // quantity * rate

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BilledItem", billedItemSchema);

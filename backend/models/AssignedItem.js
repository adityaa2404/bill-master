// backend/models/AssignedItem.js

const mongoose = require("mongoose");

const assignedItemSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },

  subsectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subsection",
    default: null,
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },

  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },

  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AssignedItem", assignedItemSchema);

// models/Section.js
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  name: { type: String, required: true },          // e.g. "Kitchen"
  order: { type: Number, default: 0 },             // for sorting in UI

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Section", sectionSchema);

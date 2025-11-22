// models/Subsection.js
const mongoose = require("mongoose");

const subsectionSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },
  name: { type: String, required: true },          // e.g. "Ceiling", "Bedroom 1"
  order: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subsection", subsectionSchema);

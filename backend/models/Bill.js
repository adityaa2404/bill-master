// models/Bill.js
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  billNumber: { type: String, required: true, unique: true },
  billDate: { type: Date, default: Date.now },

  totalAmount: { type: Number, default: 0 },
  notes: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bill", billSchema);

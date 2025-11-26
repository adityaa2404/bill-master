const mongoose = require("mongoose");

const customerItemRateSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  rate: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("CustomerItemRate", customerItemRateSchema);

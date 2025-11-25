// backend/services/assignedItemService.js

const AssignedItem = require("../models/AssignedItem");

// ⭐ FINAL FIX: MERGE LOGIC
exports.assignItem = async (data) => {
  const { customerId, sectionId, subsectionId, itemId, quantity, rate } = data;

  // CHECK FOR EXISTING
  const existing = await AssignedItem.findOne({
    customerId,
    sectionId,
    subsectionId: subsectionId || null,
    itemId,
  });

  if (existing) {
    // ⭐ MERGE: Increase quantity
    existing.quantity += quantity;

    // ⭐ Rate: update only if provided (avoid overriding unwanted)
    if (rate !== undefined) existing.rate = rate;

    return await existing.save();
  }

  // CREATE NEW
  const assigned = new AssignedItem(data);
  return await assigned.save();
};


// GET ITEMS FOR CUSTOMER
exports.getAssignedItemsForCustomer = async (customerId) => {
  return await AssignedItem.find({ customerId })
    .populate("itemId")
    .lean();
};


// UPDATE
exports.updateAssignedItem = async (id, data) => {
  return await AssignedItem.findByIdAndUpdate(id, data, { new: true });
};


// DELETE
exports.deleteAssignedItem = async (id) => {
  return await AssignedItem.findByIdAndDelete(id);
};


// CLEAR ALL
exports.clearAssignedItemsForCustomer = async (customerId) => {
  return await AssignedItem.deleteMany({ customerId });
};

const AssignedItem = require("../models/AssignedItem");

exports.assignItem = (data) => {
  return AssignedItem.create(data);
};

exports.getAssignedItemsForCustomer = (customerId) => {
  return AssignedItem.find({ customerId })
    .populate("itemId")
    .populate("sectionId")
    .populate("subsectionId");
};

const Bill = require("../models/Bill");
const BilledItem = require("../models/BilledItem");

exports.createBillRecord = (data) => {
  return Bill.create(data);
};

exports.addBilledItem = (data) => {
  return BilledItem.create(data);
};

exports.getPopulatedBilledItem = (id) => {
  return BilledItem.findById(id)
    .populate("itemId")
    .populate("sectionId")
    .populate("subsectionId");
};

exports.getBillsForCustomer = (customerId) => {
  return Bill.find({ customerId }).sort({ billDate: -1 });
};

exports.getBillWithItems = async (billId) => {
  const bill = await Bill.findById(billId).populate("customerId");
  const items = await BilledItem.find({ billId })
    .populate("itemId")
    .populate("sectionId")
    .populate("subsectionId");

  return { bill, items };
};

const CustomerItemRate = require("../models/CustomerItemRate");

exports.setRateForCustomerItem = async (customerId, itemId, rate) => {
  return await CustomerItemRate.findOneAndUpdate(
    { customerId, itemId },
    { rate },
    { upsert: true, new: true }
  );
};

exports.getRatesForCustomer = async (customerId) => {
  return await CustomerItemRate.find({ customerId }).populate("itemId");
};

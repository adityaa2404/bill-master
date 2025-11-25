const Section = require("../models/Section");

exports.createSection = (data) => {
  return Section.create(data);
};

exports.getSectionsByCustomer = (customerId) => {
  return Section.find({ customerId }).sort({ createdAt: 1 });
};

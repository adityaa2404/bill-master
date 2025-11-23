const Subsection = require("../models/Subsection");

exports.createSubsection = (data) => {
  return Subsection.create(data);
};

exports.getSubsectionsBySection = (sectionId) => {
  return Subsection.find({ sectionId }).sort({ createdAt: 1 });
};


exports.getAllSubsectionsOfCustomer = (customerId) => {
  return Subsection.find({ customerId });
};

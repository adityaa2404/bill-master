const Customer = require("../models/Customer");

exports.createCustomer = (data) => {
  return Customer.create(data);
};

exports.getAllCustomers = () => {
  return Customer.find().sort({ name: 1 });
};

exports.getCustomerById = (id) => {
  return Customer.findById(id);
};

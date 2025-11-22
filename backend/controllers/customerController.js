// controllers/customerController.js
const Customer = require("../models/Customer");

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomers = async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json(customers);
};

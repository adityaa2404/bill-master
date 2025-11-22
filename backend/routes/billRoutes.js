// routes/billRoutes.js
const express = require("express");
const router = express.Router();
const {
  createBill,
  getBillWithItems,
  getBillsForCustomer
} = require("../controllers/billController");

// create new bill
router.post("/", createBill);

// get single bill + all billed items (with populated info)
router.get("/:id", getBillWithItems);

// list bills for a customer
router.get("/customer/:customerId", getBillsForCustomer);

module.exports = router;

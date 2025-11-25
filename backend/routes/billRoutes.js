// routes/billRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBill,
  getBillWithItems,
  getBillsForCustomer,
  printBill
} = require("../controllers/billController");

// ⭐ ORDER MATTERS

// PRINT FIRST
router.get("/print/:customerId", printBill);

// CREATE BILL
router.post("/", createBill);

// GET ONE BILL
router.get("/:id", getBillWithItems);

// GET ALL BILLS FOR A CUSTOMER
router.get("/customer/:customerId", getBillsForCustomer);

module.exports = router;

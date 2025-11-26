const express = require("express");
const router = express.Router();

const {
  createBill,
  getBillWithItems,
  getBillsForCustomer,
  printBill
} = require("../controllers/billController");

// PRINT BILL (POST JSON → PDF)
router.post("/print", printBill);


router.post("/", createBill);


router.get("/customer/:customerId", getBillsForCustomer);


router.get("/:billId", getBillWithItems);

module.exports = router;

const express = require("express");
const router = express.Router();

const Customer = require("../models/Customer");
const Bill = require("../models/Bill");

/* ----------------------------------------------------------
   📌 1. TOTAL CUSTOMERS
---------------------------------------------------------- */
router.get("/customers/count", async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    res.json({ totalCustomers });
  } catch (err) {
    console.error("Customer count error", err);
    res.status(500).json({ error: "Failed to fetch customer count" });
  }
});

/* ----------------------------------------------------------
   📌 2. TOTAL BILLED AMOUNT
   (sum of totalAmount in Bills)
---------------------------------------------------------- */
router.get("/bills/total", async (req, res) => {
  try {
    const result = await Bill.aggregate([
    {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalAmount = result[0]?.totalAmount || 0;

    res.json({ totalAmount });
  } catch (err) {
    console.error("Total billing error", err);
    res.status(500).json({ error: "Failed to fetch total billed amount" });
  }
});

/* ----------------------------------------------------------
   📌 3. RECENT BILLS (latest 5 bills)
---------------------------------------------------------- */
router.get("/bills/recent", async (req, res) => {
  try {
    const recentBills = await Bill.find()
      .sort({ billDate: -1 }) // based on your schema
      .limit(5)
      .populate("customerId", "name");

    const formatted = recentBills.map((bill) => ({
      _id: bill._id,
      customerName: bill.customerId?.name || "Unknown Customer",
      date: bill.billDate,
      totalAmount: bill.totalAmount,
      billNumber: bill.billNumber,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Recent bills error", err);
    res.status(500).json({ error: "Failed to fetch recent bills" });
  }
});



// TOP 5 customers with total billed amount
router.get("/top-customers", async (req, res) => {
  try {
    const result = await Bill.aggregate([
      {
        $group: {
          _id: "$customerId",
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer"
        }
      },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          customerId: "$customer._id",
          name: "$customer.name",
          totalAmount: 1
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Top Customers Error:", err);
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
});
router.get("/recent-customers", async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});
module.exports = router;


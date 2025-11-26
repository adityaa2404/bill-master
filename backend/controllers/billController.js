const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const BilledItem = require("../models/BilledItem");

const Customer = require("../models/Customer");
const AssignedItem = require("../models/AssignedItem");
const Item = require("../models/Item");
const Section = require("../models/Section");
const Subsection = require("../models/Subsection");


// ----------------------------------------------------
// ✅ CREATE BILL (USES AssignedItem)
// ----------------------------------------------------
exports.createBill = async (req, res) => {
  try {
    const { customerId, notes } = req.body;

    const assigned = await AssignedItem.find({ customerId }).lean();
    if (!assigned.length)
      return res.status(400).json({ error: "No assigned items found" });

    const allItems = await Item.find().lean();
    const sections = await Section.find({ customerId }).lean();
    const subsections = await Subsection.find({ customerId }).lean();

    const itemMap = Object.fromEntries(
      allItems.map((i) => [i._id.toString(), i])
    );

    const billNumber = "BILL-" + Date.now();

    const newBill = await Bill.create({
      customerId,
      billNumber,
      notes: notes || "",
      totalAmount: 0,
    });

    let totalAmount = 0;

    for (let a of assigned) {
      const amount = a.quantity * a.rate;
      totalAmount += amount;

      await BilledItem.create({
        billId: newBill._id,
        customerId,
        itemId: a.itemId,
        sectionId: a.sectionId,
        subsectionId: a.subsectionId || null,
        quantity: a.quantity,
        rate: a.rate,
        amount,
        description: a.notes || "",
      });
    }

    newBill.totalAmount = totalAmount;
    await newBill.save();

    res.json({
      success: true,
      billId: newBill._id,
      billNumber,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// ✅ GET SINGLE BILL + ITEMS
// ----------------------------------------------------
exports.getBillWithItems = async (req, res) => {
  try {
    const billId = req.params.billId;

    const bill = await Bill.findById(billId).populate("customerId").lean();
    if (!bill) return res.status(404).json({ error: "Bill not found" });

    const items = await BilledItem.find({ billId })
      .populate("itemId")
      .populate("sectionId")
      .populate("subsectionId")
      .lean();

    res.json({ bill, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// ✅ GET ALL BILLS FOR CUSTOMER
// ----------------------------------------------------
exports.getBillsForCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const bills = await Bill.find({ customerId }).sort({ billDate: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------------------
// ✅ PRINT BILL (DEBUG MODE — RETURNS JSON ONLY)
// ----------------------------------------------------
exports.printBill = async (req, res) => {
  try {
    const billJSON = req.body;

    console.log("🟢 RECEIVED BILL JSON:", billJSON);

    const invoiceFolder = path.join(__dirname, "../invoice");
    if (!fs.existsSync(invoiceFolder)) fs.mkdirSync(invoiceFolder);

    const tempJson = path.join(invoiceFolder, "temp_bill.json");
    const outputPdf = path.join(invoiceFolder, "output.pdf");

    fs.writeFileSync(tempJson, JSON.stringify(billJSON, null, 2));

    exec(
      `python backend/invoice/gen_invoice.py "${tempJson}" "${outputPdf}"`,
      (err, stdout, stderr) => {
        if (err) {
          console.error("❌ Python Error:", err);
          return res.status(500).json({ error: "PDF generation failed" });
        }

        const pdf = fs.readFileSync(outputPdf);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=bill.pdf");
        res.send(pdf);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
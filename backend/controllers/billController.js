// controllers/billController.js
const Bill = require("../models/Bill");
const BilledItem = require("../models/BilledItem");

exports.createBill = async (req, res) => {
  try {
    const { customerId, items, notes } = req.body;
    // items = [ { itemId, sectionId, subsectionId, quantity, rate, description? } ]

    // simple bill number generator; you can replace later
    const billNumber = "BILL-" + Date.now();

    const bill = await Bill.create({
      customerId,
      billNumber,
      notes: notes || "",
      totalAmount: 0
    });

    let total = 0;

    for (const it of items) {
      const amount = it.quantity * it.rate;
      total += amount;

      await BilledItem.create({
        billId: bill._id,
        customerId,
        itemId: it.itemId,
        sectionId: it.sectionId,
        subsectionId: it.subsectionId || null,
        description: it.description || "",
        quantity: it.quantity,
        rate: it.rate,
        amount
      });
    }

    bill.totalAmount = total;
    await bill.save();

    res.json({ billId: bill._id, billNumber: bill.billNumber, totalAmount: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBillWithItems = async (req, res) => {
  const { id } = req.params;

  const bill = await Bill.findById(id).populate("customerId");
  if (!bill) return res.status(404).json({ error: "Bill not found" });

  const items = await BilledItem.find({ billId: id })
    .populate("itemId")
    .populate("sectionId")
    .populate("subsectionId");

  res.json({ bill, items });
};

exports.getBillsForCustomer = async (req, res) => {
  const { customerId } = req.params;
  const bills = await Bill.find({ customerId }).sort({ billDate: -1 });
  res.json(bills);
};

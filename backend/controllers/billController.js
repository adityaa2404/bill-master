// controllers/billController.js
const billService = require("../services/billService");
const customerService = require("../services/customerService");

exports.createBill = async (req, res) => {
  try {
    const { customerId, items, notes } = req.body;

    const billNumber = "BILL-" + Date.now();

    const bill = await billService.createBillRecord({
      customerId,
      billNumber,
      billDate: new Date(),
      notes: notes || "",
      totalAmount: 0
    });

    let total = 0;
    const outputItems = [];

    for (const it of items) {
      const amount = it.quantity * it.rate;
      total += amount;

      const billedItem = await billService.addBilledItem({
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

      const populated = await billService.getPopulatedBilledItem(billedItem._id);

      outputItems.push({
        itemId: populated.itemId._id,
        name: populated.itemId.name,
        unit: populated.itemId.unit,
        section: populated.sectionId?.name || null,
        subsection: populated.subsectionId?.name || null,
        quantity: populated.quantity,
        rate: populated.rate,
        amount: populated.amount,
        description: populated.description
      });
    }

    bill.totalAmount = total;
    await bill.save();

    const customer = await customerService.getCustomerById(customerId);

    res.json({
      billId: bill._id,
      billNumber,
      billDate: bill.billDate,
      notes: bill.notes,
      totalAmount: bill.totalAmount,

      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        gstNumber: customer.gstNumber
      },

      items: outputItems
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBillWithItems = async (req, res) => {
  try {
    const data = await billService.getBillWithItems(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBillsForCustomer = async (req, res) => {
  try {
    const bills = await billService.getBillsForCustomer(req.params.customerId);
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

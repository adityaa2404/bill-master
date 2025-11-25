const Customer = require("../models/Customer");
const AssignedItem = require("../models/AssignedItem");
const Item = require("../models/Item");
const Section = require("../models/Section");
const Subsection = require("../models/Subsection");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/* ----------------------------------------------------
   🟢 CREATE BILL  (dummy — you can modify later)
---------------------------------------------------- */
exports.createBill = async (req, res) => {
  try {
    return res.json({ message: "Bill created (placeholder logic)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------
   🟢 GET SINGLE BILL (placeholder)
---------------------------------------------------- */
exports.getBillWithItems = async (req, res) => {
  try {
    return res.json({ message: "Fetching a bill… (placeholder)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------
   🟢 GET ALL BILLS FOR A CUSTOMER (placeholder)
---------------------------------------------------- */
exports.getBillsForCustomer = async (req, res) => {
  try {
    return res.json({ message: "Fetching all bills… (placeholder)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------
   🟢 PRINT BILL — FULL LOGIC (your working code)
---------------------------------------------------- */
exports.printBill = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const customer = await Customer.findById(customerId).lean();
    const sections = await Section.find({ customerId }).lean();
    const subsections = await Subsection.find({ customerId }).lean();
    const assigned = await AssignedItem.find({ customerId }).lean();
    const allItems = await Item.find().lean();

    const itemMap = {};
    allItems.forEach((i) => (itemMap[i._id] = i));

    const finalSections = sections.map((sec) => {
      const secSubs = subsections.filter(
        (s) => s.sectionId.toString() === sec._id.toString()
      );

      const secAssigned = assigned.filter(
        (a) =>
          a.sectionId.toString() === sec._id.toString() &&
          !a.subsectionId
      );

      return {
        sectionId: sec._id,
        sectionName: sec.name,
        items: secAssigned.map((i) => ({
          id: i._id,
          itemId: i.itemId,
          name: itemMap[i.itemId]?.name || "",
          unit: itemMap[i.itemId]?.unit || "",
          quantity: i.quantity,
          rate: i.rate,
          amount: i.quantity * i.rate,
        })),
        subsections: secSubs.map((sub) => {
          const subAssigned = assigned.filter(
            (a) =>
              a.subsectionId &&
              a.subsectionId.toString() === sub._id.toString()
          );

          return {
            subsectionId: sub._id,
            name: sub.name,
            items: subAssigned.map((i) => ({
              id: i._id,
              itemId: i.itemId,
              name: itemMap[i.itemId]?.name || "",
              unit: itemMap[i.itemId]?.unit || "",
              quantity: i.quantity,
              rate: i.rate,
              amount: i.quantity * i.rate,
            })),
          };
        }),
      };
    });

    const billJSON = {
      customer,
      billNumber: "BILL-" + Date.now(),
      billDate: new Date().toISOString(),
      totalAmount: assigned.reduce((s, i) => s + i.quantity * i.rate, 0),
      sections: finalSections,

      company: {
        name: "Dattatray Potdar",
        address: "Sunshine Nagar, Rahatani, Pune - 411018",
        email: "dpp1980@gmail.com",
        gst: "27ABCDE1234F1Z5",
        bank: "HDFC BANK",
        account_no: "00071140048455",
        ifsc: "HDFC0000007",
        branch: "BHANDARKAR ROAD",
      },
    };

    const tempJson = path.join(__dirname, "../pdf/temp_bill.json");
    const outputPdf = path.join(__dirname, "../pdf/output.pdf");

    fs.writeFileSync(tempJson, JSON.stringify(billJSON, null, 2));

    exec(
      `python backend/pdf/generate_invoice.py ${tempJson} ${outputPdf}`,
      (err) => {
        if (err)
          return res.status(500).json({ error: "PDF generation failed", details: err });

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

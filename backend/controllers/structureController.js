// controllers/structureController.js
const sectionService = require("../services/sectionService");
const subsectionService = require("../services/subsectionService");
const assignedItemService = require("../services/AssignedItemService");
const Section = require("../models/Section");
const Subsection = require("../models/Subsection");
const AssignedItem = require("../models/AssignedItem");
const Customer = require("../models/Customer");

const CustomerItemRate = require("../models/CustomerItemRate");
const customerItemRateService = require("../services/customerItemRateService");
exports.createSection = async (req, res) => {
  try {
    const section = await sectionService.createSection(req.body);
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSectionsByCustomer = async (req, res) => {
  try {
    const sections = await sectionService.getSectionsByCustomer(req.params.customerId);
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubsection = async (req, res) => {
  try {
    const subsection = await subsectionService.createSubsection(req.body);
    res.json(subsection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubsectionsBySection = async (req, res) => {
  try {
    const subs = await subsectionService.getSubsectionsBySection(req.params.sectionId);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignItem = async (req, res) => {
  console.log("🟦 ASSIGN RECEIVED BODY:", req.body);

  try {
    const assigned = await assignedItemService.assignItem(req.body);
    console.log("🟩 ITEM SAVED:", assigned._id);

    // 🔥 VERY IMPORTANT: SAVE RATE PER CUSTOMER
    console.log("🟦 SAVING RATE:", {
      customer: req.body.customerId,
      item: req.body.itemId,
      rate: req.body.rate
    });

    await customerItemRateService.setRateForCustomerItem(
      req.body.customerId,
      req.body.itemId,
      req.body.rate
    );

    console.log("🟩 RATE UPDATED SUCCESSFULLY");

    res.json(assigned);

  } catch (err) {
    console.log("🟥 ASSIGN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.getFullStructure = async (req, res) => {
  try {
    const { customerId } = req.params;

    const sections = await sectionService.getSectionsByCustomer(customerId);
    const subs = await subsectionService.getAllSubsectionsOfCustomer(customerId);
    const assigned = await assignedItemService.getAssignedItemsForCustomer(customerId);

    console.log("🟦 SECTIONS:", sections.length);
    console.log("🟦 SUBSECTIONS:", subs.length);
    console.log("🟦 ASSIGNED ITEMS:", assigned.length);

    const structure = sections.map(section => ({
      sectionId: section._id,
      sectionName: section.name,

      // ---------- FIXED GLOBAL ITEMS ----------
      items: assigned
  .filter(a =>
    a.sectionId?._id?.toString() === section._id.toString() &&
    !a.subsectionId
  )
  .map(a => ({
    id: a._id,
    itemId: a.itemId._id,
    name: a.itemId.name,
    unit: a.itemId.unit,
    quantity: a.quantity || 0,
    rate: a.rate || 0,
    notes: a.notes || ""
  })),


      // ---------- SUBSECTIONS ----------
      subsections: subs
        .filter(s => s.sectionId.toString() === section._id.toString())
        .map(sub => ({
          subsectionId: sub._id,
          name: sub.name,

          // ---------- FIXED ITEMS INSIDE SUBSECTION ----------
          items: assigned
  .filter(a =>
    a.subsectionId?._id?.toString() === sub._id.toString()
  )
  .map(a => ({
    id: a._id,
    itemId: a.itemId._id,
    name: a.itemId.name,
    unit: a.itemId.unit,
    quantity: a.quantity || 0,
    rate: a.rate || 0,
    notes: a.notes || ""
  })),
        })),
    }));

    res.json(structure);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignedItemsForCustomer = async (req, res) => {
  try {
    const items = await assignedItemService.getAssignedItemsForCustomer(
      req.params.customerId
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/structureController.js (continuation)

exports.updateAssignedItem = async (req, res) => {
  try {
    const updated = await assignedItemService.updateAssignedItem(
      req.params.id,
      req.body
    );
    if (!updated) return res.status(404).json({ error: "Assigned item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAssignedItem = async (req, res) => {
  try {
    await assignedItemService.deleteAssignedItem(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearAssignedForCustomer = async (req, res) => {
  try {
    await assignedItemService.clearAssignedItemsForCustomer(
      req.params.customerId
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a whole section: its subsections + all assigned items
exports.deleteSection = async (req, res) => {
  try {
    const sectionId = req.params.id;

    if (!sectionId) {
      return res.status(400).json({ error: "Section id is required" });
    }

    // 1) Find all subsections under this section
    const subsections = await Subsection.find({ sectionId }).select("_id");
    const subIds = subsections.map((s) => s._id);

    // 2) Delete assigned items belonging to:
    //    - the section (global items)
    //    - any of its subsections
    await AssignedItem.deleteMany({
      $or: [
        { sectionId }, // global items in this section
        { subsectionId: { $in: subIds } }, // items under subsections
      ],
    });

    // 3) Delete subsections
    await Subsection.deleteMany({ sectionId });

    // 4) Delete the section itself
    await Section.findByIdAndDelete(sectionId);

    res.json({ success: true, id: sectionId });
  } catch (err) {
    console.error("Error deleting section:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a single subsection and its assigned items
exports.deleteSubsection = async (req, res) => {
  try {
    const subId = req.params.id;

    if (!subId) {
      return res.status(400).json({ error: "Subsection id is required" });
    }

    // 1) Delete assigned items in this subsection
    await AssignedItem.deleteMany({ subsectionId: subId });

    // 2) Delete the subsection itself
    await Subsection.findByIdAndDelete(subId);

    res.json({ success: true, id: subId });
  } catch (err) {
    console.error("Error deleting subsection:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getCustomerRates = async (req, res) => {
  try {
    const { customerId } = req.params;
    const rates = await customerItemRateService.getRatesForCustomer(customerId);
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllItemsInBill = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // 🔹 Fetch customer details
    const customer = await Customer.findById(customerId).lean();

    // 🔹 Fetch all billed items
    const items = await AssignedItem.find({ customerId })
      .populate("itemId", "name unit")
      .lean();

    // 🔹 Format items
    const output = items.map((it) => ({
      id: it._id,
      itemId: it.itemId._id,
      name: it.itemId.name,
      unit: it.itemId.unit,
      quantity: it.quantity,
      rate: it.rate,
      amount: it.quantity * it.rate,
      sectionId: it.sectionId,
      subsectionId: it.subsectionId
    }));

    // 🔹 Return final JSON
    res.json({
      customer,
      items: output,
    });

  } catch (err) {
    console.log("🟥 ERROR GETTING ALL ITEMS:", err);
    res.status(500).json({ error: err.message });
  }
};

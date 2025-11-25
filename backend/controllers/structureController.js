// controllers/structureController.js
const sectionService = require("../services/sectionService");
const subsectionService = require("../services/subsectionService");
const assignedItemService = require("../services/assignedItemService");

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
    console.log("🟩 SAVED DOCUMENT:", assigned);
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

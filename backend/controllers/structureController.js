// controllers/structureController.js
const Section = require("../models/Section");
const Subsection = require("../models/Subsection");
const AssignedItem = require("../models/AssignedItem");

// SECTION
exports.createSection = async (req, res) => {
  try {
    const section = await Section.create(req.body); // {customerId, name, order?}
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSectionsByCustomer = async (req, res) => {
  const { customerId } = req.params;
  const sections = await Section.find({ customerId }).sort({ order: 1, createdAt: 1 });
  res.json(sections);
};

// SUBSECTION
exports.createSubsection = async (req, res) => {
  try {
    const subsection = await Subsection.create(req.body); // {customerId, sectionId, name, order?}
    res.json(subsection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubsectionsBySection = async (req, res) => {
  const { sectionId } = req.params;
  const subs = await Subsection.find({ sectionId }).sort({ order: 1, createdAt: 1 });
  res.json(subs);
};

// ASSIGN MASTER ITEM TO SECTION / SUBSECTION
exports.assignItem = async (req, res) => {
  try {
    // body: { customerId, sectionId, subsectionId (optional), itemId, notes }
    const assigned = await AssignedItem.create(req.body);
    res.json(assigned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all assigned items for a customer's project structure
exports.getAssignedItemsForCustomer = async (req, res) => {
  const { customerId } = req.params;
  const items = await AssignedItem.find({ customerId })
    .populate("itemId")
    .populate("sectionId")
    .populate("subsectionId");
  res.json(items);
};

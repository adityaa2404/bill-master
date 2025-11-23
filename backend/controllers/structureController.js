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
  try {
    const assigned = await assignedItemService.assignItem(req.body);
    res.json(assigned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FULL STRUCTURE (Sections → Subsections → Assigned Items)
exports.getFullStructure = async (req, res) => {
  try {
    const { customerId } = req.params;

    const sections = await sectionService.getSectionsByCustomer(customerId);
    const subs = await subsectionService.getAllSubsectionsOfCustomer(customerId);
    const assigned = await assignedItemService.getAssignedItemsForCustomer(customerId);

    const structure = sections.map(section => ({
      sectionId: section._id,
      sectionName: section.name,

      items: assigned.filter(a =>
        a.sectionId.toString() === section._id.toString() && !a.subsectionId
      ).map(a => ({
        id: a._id,
        itemId: a.itemId._id,
        name: a.itemId.name,
        unit: a.itemId.unit,
        notes: a.notes,
      })),

      subsections: subs.filter(s =>
        s.sectionId.toString() === section._id.toString()
      ).map(sub => ({
        subsectionId: sub._id,
        name: sub.name,
        items: assigned.filter(a =>
          a.subsectionId &&
          a.subsectionId.toString() === sub._id.toString()
        ).map(a => ({
          id: a._id,
          itemId: a.itemId._id,
          name: a.itemId.name,
          unit: a.itemId.unit,
          notes: a.notes,
        }))
      }))
    }));

    res.json(structure);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

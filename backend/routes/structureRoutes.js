// routes/structureRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSection,
  getSectionsByCustomer,
  createSubsection,
  getSubsectionsBySection,
  assignItem,
  getAssignedItemsForCustomer
} = require("../controllers/structureController");

// sections
router.post("/sections", createSection);
router.get("/sections/:customerId", getSectionsByCustomer);

// subsections
router.post("/subsections", createSubsection);
router.get("/subsections/by-section/:sectionId", getSubsectionsBySection);

// assigned items (project structure)
router.post("/assign-item", assignItem);
router.get("/assigned-items/:customerId", getAssignedItemsForCustomer);

module.exports = router;

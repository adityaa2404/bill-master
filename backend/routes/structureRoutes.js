// // routes/structureRoutes.js
// const express = require("express");
// const router = express.Router();
// const {
//   createSection,
//   getSectionsByCustomer,
//   createSubsection,
//   getSubsectionsBySection,
//   assignItem,
//   getAssignedItemsForCustomer
// } = require("../controllers/structureController");

// // sections
// router.post("/sections", createSection);
// router.get("/sections/:customerId", getSectionsByCustomer);

// // subsections
// router.post("/subsections", createSubsection);
// router.get("/subsections/by-section/:sectionId", getSubsectionsBySection);

// // assigned items (project structure)
// router.post("/assign-item", assignItem);
// router.get("/assigned-items/:customerId", getAssignedItemsForCustomer);

// module.exports = router;

// backend/routes/structureRoutes.js
const express = require("express");
const router = express.Router();
const structureController = require("../controllers/structureController");

// Sections
router.post("/sections", structureController.createSection);
router.get("/sections/:customerId", structureController.getSectionsByCustomer);

// Subsections
router.post("/subsections", structureController.createSubsection);
router.get("/subsections/by-section/:sectionId", structureController.getSubsectionsBySection);

// Assigned items (items inside sections / subsections)
router.post("/assign", structureController.assignItem);
router.get("/assigned/:customerId", structureController.getAssignedItemsForCustomer);

// Full structure for billing page
router.get("/full/:customerId", structureController.getFullStructure);

// NEW: update / delete / clear assigned items
router.patch("/assigned/:id", structureController.updateAssignedItem);
router.delete("/assigned/:id", structureController.deleteAssignedItem);
router.delete(
  "/assigned/customer/:customerId",
  structureController.clearAssignedForCustomer
);

module.exports = router;

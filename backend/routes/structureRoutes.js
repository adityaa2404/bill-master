// backend/routes/structureRoutes.js
const express = require("express");
const router = express.Router();
const structureController = require("../controllers/structureController");
const { getCustomerRates } = require("../controllers/structureController");

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
router.delete("/sections/:id", structureController.deleteSection);

// delete subsection (and its items)
router.delete("/subsections/:id", structureController.deleteSubsection);


router.get("/rates/:customerId", getCustomerRates);

router.get(
  "/bill-items/:customerId",
  structureController.getAllItemsInBill
);




module.exports = router;

// routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const { createItem, getItems } = require("../controllers/itemController");

router.post("/", createItem); // add master item
router.get("/", getItems);   // list master items

module.exports = router;

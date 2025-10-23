const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  submitInvestigationOrder,
  getInvestigationResults,
  investigationValidation,
} = require("../controllers/investigationController");

// Apply authentication to all routes
router.use(authMiddleware);

// POST /api/investigations - Submit an investigation order
router.post("/", investigationValidation, submitInvestigationOrder);

// GET /api/investigations/:id/results - Get investigation results
router.get("/:id/results", getInvestigationResults);

module.exports = router;

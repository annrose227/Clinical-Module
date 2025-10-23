const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getPatientHistory } = require("../controllers/patientHistoryController");

// Apply authentication to all routes
router.use(authMiddleware);

// GET /api/patients/:patientId/history - Retrieve patient consultation history
router.get("/:patientId/history", getPatientHistory);

module.exports = router;

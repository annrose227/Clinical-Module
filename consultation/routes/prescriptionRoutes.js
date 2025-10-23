const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPrescription,
  submitPrescription,
  prescriptionValidation,
} = require("../controllers/prescriptionController");

// Apply authentication to all routes
router.use(authMiddleware);

// POST /api/prescriptions - Create a new prescription
router.post("/", prescriptionValidation, createPrescription);

// PUT /api/prescriptions/:id/submit - Submit a prescription
router.put("/:id/submit", submitPrescription);

module.exports = router;

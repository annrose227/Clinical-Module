const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createConsultation,
  updateConsultation,
  consultationValidation,
  consultationUpdateValidation,
} = require("../controllers/consultationController");

// Apply authentication to all routes
router.use(authMiddleware);

// POST /api/consultations - Create a new consultation
router.post("/", consultationValidation, createConsultation);

// PUT /api/consultations/:id - Update an existing consultation
router.put("/:id", consultationUpdateValidation, updateConsultation);

module.exports = router;

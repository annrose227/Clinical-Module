const { body, validationResult } = require("express-validator");
const { Consultation, consultations } = require("../models/Consultation");
const { fetchPatientDetails } = require("../services/externalServices");

// Validation rules
const consultationValidation = [
  body("patientId").isString().notEmpty().withMessage("Patient ID is required"),
  body("notes").isString().notEmpty().withMessage("Notes are required"),
  body("status").optional().isIn(["active", "completed"]).withMessage("Invalid status"),
];

const consultationUpdateValidation = [
  body("notes").optional().isString().notEmpty().withMessage("Notes must be a non-empty string"),
  body("status").optional().isIn(["active", "completed"]).withMessage("Invalid status"),
];

// Create a new consultation
const createConsultation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { patientId, notes, status = "active" } = req.body;
  const doctorId = req.user.id; // From JWT

  // TODO: Fetch patient details from User Management service
  // const patient = await fetchPatientDetails(patientId);
  // if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const consultation = new Consultation(consultations.length + 1, patientId, doctorId, notes, new Date(), status);
  consultations.push(consultation);

  // TODO: Post EMR updates and consultation data to EMR system
  // await postToEMR(consultation);

  res.status(201).json(consultation);
};

// Update an existing consultation
const updateConsultation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if there's at least one field to update
  if (!updateData.notes && !updateData.status) {
    return res.status(400).json({ error: "At least one field (notes or status) must be provided for update" });
  }
  const { notes, status } = updateData;
  const consultation = consultations.find((c) => c.id == id);

  if (!consultation) {
    return res.status(404).json({ error: "Consultation not found" });
  }

  if (consultation.doctorId !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (notes) consultation.notes = notes;
  if (status) consultation.status = status;

  // TODO: Post updated consultation data to EMR system
  // await postToEMR(consultation);

  res.json(consultation);
};

module.exports = {
  createConsultation,
  updateConsultation,
  consultationValidation,
  consultationUpdateValidation,
};

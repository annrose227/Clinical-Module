const { body, validationResult } = require("express-validator");
const { Prescription, Medication, prescriptions } = require("../models/Prescription");
const {
  performFormularySearch,
  checkBrandAvailability,
  conductDrugInteractionAnalysis,
  validatePrescription,
} = require("../services/externalServices");

// Validation rules
const prescriptionValidation = [
  body("consultationId").isInt().withMessage("Consultation ID must be an integer"),
  body("medications").isArray({ min: 1 }).withMessage("At least one medication is required"),
  body("medications.*.drugName").isString().notEmpty().withMessage("Drug name is required"),
  body("medications.*.dosage").isString().notEmpty().withMessage("Dosage is required"),
  body("medications.*.frequency").isString().notEmpty().withMessage("Frequency is required"),
  body("medications.*.duration").isString().notEmpty().withMessage("Duration is required"),
  body("medications.*.brandPreference").optional().isString().withMessage("Brand preference must be a string"),
];

// Create a new prescription
const createPrescription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { consultationId, medications } = req.body;

  // TODO: Perform formulary search and brand availability checks from Pharmacy / Formulary services
  // const formularyResults = await performFormularySearch(medications);
  // const availabilityResults = await checkBrandAvailability(medications);

  // TODO: Conduct drug interaction analysis and prescription validation from Clinical Decision Support APIs
  // const interactionResults = await conductDrugInteractionAnalysis(medications);
  // const validationResults = await validatePrescription(medications);

  const meds = medications.map((m) => new Medication(m.drugName, m.dosage, m.frequency, m.duration, m.brandPreference));
  const prescription = new Prescription(prescriptions.length + 1, consultationId, meds, "draft");
  prescriptions.push(prescription);

  res.status(201).json(prescription);
};

// Submit a prescription (e.g., send to pharmacy)
const submitPrescription = async (req, res) => {
  const { id } = req.params;
  const prescription = prescriptions.find((p) => p.id == id);

  if (!prescription) {
    return res.status(404).json({ error: "Prescription not found" });
  }

  prescription.status = "submitted";

  // TODO: Send e-prescriptions and pharmacy orders to Pharmacy Information System
  // await sendToPharmacyInformationSystem(prescription);

  // TODO: Trigger patient notifications to Messaging/Notification service
  // await triggerPatientNotification(prescription.patientId, 'Prescription submitted');

  res.json(prescription);
};

module.exports = {
  createPrescription,
  submitPrescription,
  prescriptionValidation,
};

const { body, validationResult } = require("express-validator");
const { Investigation, investigations } = require("../models/Investigation");

// Validation rules
const investigationValidation = [
  body("consultationId").isInt().withMessage("Consultation ID must be an integer"),
  body("testName").isString().notEmpty().withMessage("Test name is required"),
];

// Submit an investigation order
const submitInvestigationOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { consultationId, testName } = req.body;

  const investigation = new Investigation(investigations.length + 1, consultationId, testName, "ordered", null);
  investigations.push(investigation);

  // TODO: Integrate with Laboratory Information System (LIS) or Radiology Information System (RIS) to submit orders
  // await submitToLabOrRadiologySystem(investigation);

  res.status(201).json(investigation);
};

// Get investigation results (stub for now)
const getInvestigationResults = async (req, res) => {
  const { id } = req.params;
  const investigation = investigations.find((i) => i.id == id);

  if (!investigation) {
    return res.status(404).json({ error: "Investigation not found" });
  }

  // TODO: Fetch results from LIS/RIS systems
  // const results = await fetchResultsFromLabOrRadiologySystem(investigation.id);

  res.json(investigation);
};

module.exports = {
  submitInvestigationOrder,
  getInvestigationResults,
  investigationValidation,
};

const express = require("express");
const Joi = require("joi");
const VitalsRecord = require("../models/VitalsRecord");
const { detectAnomaly } = require("../utils/anomalyDetection");
const {
  cacheVitals,
  setVitalsCache,
  clearVitalsCache,
} = require("../utils/cache");
const { syncToEMR } = require("../utils/emrSync");
const { checkAndSendAlerts } = require("../utils/alerts");

const router = express.Router();

// Joi validation schemas
const vitalSchema = Joi.object({
  patientId: Joi.string().required(),
  nurseId: Joi.string().required(),
  heartRate: Joi.number().integer().min(0).required(),
  bloodPressure: Joi.object({
    systolic: Joi.number().integer().min(0).required(),
    diastolic: Joi.number().integer().min(0).required(),
  }).required(),
  temperature: Joi.number().min(0).required(),
});

// Middleware for validation
const validateVital = (req, res, next) => {
  const { error } = vitalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// GET all vitals (with caching)
router.get("/", cacheVitals, async (req, res) => {
  try {
    const vitals = await VitalsRecord.find();
    await setVitalsCache(vitals);
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new vital
router.post("/", validateVital, async (req, res) => {
  try {
    const payload = req.body;
    const newVital = new VitalsRecord(payload);

    // Check for anomaly and send alerts
    checkAndSendAlerts(payload);

    await newVital.save();

    // Clear cache since data has changed
    await clearVitalsCache();

    // Sync to EMR
    try {
      await syncToEMR(payload);
      console.log("EMR sync completed");
    } catch (emrError) {
      console.error("EMR sync failed:", emrError);
      // Don't fail the request if EMR sync fails
    }

    res.status(201).json(newVital);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET vitals by patientId
router.get("/:patientId", async (req, res) => {
  try {
    const vitals = await VitalsRecord.find({ patientId: req.params.patientId });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

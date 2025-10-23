const Joi = require("joi");
const labService = require("../services/labService");

// Validation schemas
const createOrderSchema = Joi.object({
  patientId: Joi.string().uuid().required(),
  orderedBy: Joi.string().uuid().required(),
  priority: Joi.string().valid("routine", "urgent", "stat").default("routine"),
  tests: Joi.array()
    .items(
      Joi.object({
        testId: Joi.string().uuid().required(),
        notes: Joi.string().allow(""),
      })
    )
    .min(1)
    .required(),
});

const updateSampleCollectionSchema = Joi.object({
  collectionStatus: Joi.string().valid("collected", "rejected", "cancelled").required(),
  collectedBy: Joi.string().uuid().required(),
  notes: Joi.string().allow(""),
});

const createResultSchema = Joi.object({
  sampleId: Joi.string().uuid().required(),
  labTestId: Joi.string().uuid().required(),
  value: Joi.string().required(),
  unit: Joi.string().allow(""),
  referenceRange: Joi.string().allow(""),
  performedBy: Joi.string().uuid().required(),
  notes: Joi.string().allow(""),
});

const verifyResultSchema = Joi.object({
  verifiedBy: Joi.string().uuid().required(),
  status: Joi.string().valid("verified", "rejected").required(),
  notes: Joi.string().allow(""),
});

// Controllers
const createOrder = async (req, res, next) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const order = await labService.createOrder(value);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await labService.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await labService.getOrders(req.query);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const updateSampleCollection = async (req, res, next) => {
  try {
    const { error, value } = updateSampleCollectionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const sample = await labService.updateSampleCollection(req.params.id, value);
    if (!sample) {
      return res.status(404).json({ error: "Sample not found" });
    }
    res.json(sample);
  } catch (err) {
    next(err);
  }
};

const getSamples = async (req, res, next) => {
  try {
    const samples = await labService.getSamples(req.params.orderId);
    res.json(samples);
  } catch (err) {
    next(err);
  }
};

const createResult = async (req, res, next) => {
  try {
    const { error, value } = createResultSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await labService.createResult(value);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const verifyResult = async (req, res, next) => {
  try {
    const { error, value } = verifyResultSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await labService.verifyResult(req.params.id, value);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getResults = async (req, res, next) => {
  try {
    const results = await labService.getResults(req.params.sampleId);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

const getPatientReport = async (req, res, next) => {
  try {
    const report = await labService.getPatientReport(req.params.patientId);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateSampleCollection,
  getSamples,
  createResult,
  verifyResult,
  getResults,
  getPatientReport,
};

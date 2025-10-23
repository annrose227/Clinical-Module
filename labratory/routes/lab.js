const express = require("express");
const router = express.Router();
const labController = require("../controllers/labController");

// Lab test orders
router.post("/orders", labController.createOrder);
router.get("/orders/:id", labController.getOrder);
router.get("/orders", labController.getOrders);

// Sample collection
router.put("/samples/:id/collection", labController.updateSampleCollection);
router.get("/samples/:orderId", labController.getSamples);

// Lab results
router.post("/results", labController.createResult);
router.put("/results/:id/verification", labController.verifyResult);
router.get("/results/:sampleId", labController.getResults);

// Patient reports
router.get("/reports/:patientId", labController.getPatientReport);

module.exports = router;

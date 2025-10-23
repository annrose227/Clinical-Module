const express = require("express");
const VitalsRecord = require("../models/VitalsRecord");
const { getRecentAlerts } = require("../utils/alerts");
const { detectAnomaly } = require("../utils/anomalyDetection");

const router = express.Router();

// GET dashboard data
router.get("/", async (req, res) => {
  try {
    // Get vitals summary
    const totalVitals = await VitalsRecord.countDocuments();
    const recentVitals = await VitalsRecord.find()
      .sort({ timestamp: -1 })
      .limit(10);

    // Get alerts
    const alerts = await getRecentAlerts();

    // Get anomaly statistics
    const allVitals = await VitalsRecord.find();
    const anomaliesCount = allVitals.reduce((count, vital) => {
      const anomaly = detectAnomaly(vital.toObject());
      return anomaly ? count + 1 : count;
    }, 0);

    const dashboardData = {
      summary: {
        totalVitals,
        anomaliesCount,
        normalCount: totalVitals - anomaliesCount,
        alertCount: alerts.filter((a) => !a.acknowledged).length,
      },
      recentVitals,
      alerts,
      timestamp: new Date().toISOString(),
    };

    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET alerts
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await getRecentAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST acknowledge alert
router.post("/alerts/:alertId/acknowledge", async (req, res) => {
  try {
    const { acknowledgeAlert } = require("../utils/alerts");
    const result = await acknowledgeAlert(req.params.alertId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

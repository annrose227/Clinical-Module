const { detectAnomaly } = require("./anomalyDetection");

// Alert system using Socket.IO for real-time notifications
let io;

const initializeAlerts = (socketIoInstance) => {
  io = socketIoInstance;
};

// Check for anomalies and send alerts
const checkAndSendAlerts = (vitalsData) => {
  const anomalies = detectAnomaly(vitalsData);

  if (anomalies) {
    const alertData = {
      patientId: vitalsData.patientId,
      nurseId: vitalsData.nurseId,
      timestamp: vitalsData.timestamp,
      anomalies: anomalies,
      severity: getSeverityLevel(anomalies),
      message: `Abnormal vitals detected for patient ${vitalsData.patientId}`,
    };

    // Send real-time alert via Socket.IO
    if (io) {
      io.emit("vitals-alert", alertData);
      console.log("Real-time alert sent:", alertData);
    }

    // Log alert for dashboard
    console.log("ALERT:", alertData);

    return alertData;
  }

  return null;
};

// Determine severity level based on number and type of anomalies
const getSeverityLevel = (anomalies) => {
  if (anomalies.length >= 3) return "critical";
  if (anomalies.length === 2) return "high";
  return "medium";
};

// Get recent alerts (for dashboard)
const getRecentAlerts = async () => {
  // In a real implementation, this would query a database
  // For now, return a mock response
  return [
    {
      id: "alert-1",
      patientId: "patient-003",
      severity: "critical",
      message: "Multiple abnormal vitals detected",
      timestamp: new Date().toISOString(),
      acknowledged: false,
    },
  ];
};

// Acknowledge alert
const acknowledgeAlert = async (alertId) => {
  console.log(`Alert ${alertId} acknowledged`);
  // In real implementation, update database
  return { success: true, message: "Alert acknowledged" };
};

module.exports = {
  initializeAlerts,
  checkAndSendAlerts,
  getRecentAlerts,
  acknowledgeAlert,
};

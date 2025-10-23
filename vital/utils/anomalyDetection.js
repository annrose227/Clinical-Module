// Simple anomaly detection based on basic thresholds
// In a real-world scenario, this could use machine learning models

const NORMAL_RANGES = {
  heartRate: { min: 60, max: 100 },
  systolicBP: { min: 90, max: 140 },
  diastolicBP: { min: 60, max: 90 },
  temperature: { min: 36.1, max: 37.5 },
};

function detectAnomaly(vitalData) {
  const anomalies = [];

  if (
    vitalData.heartRate < NORMAL_RANGES.heartRate.min ||
    vitalData.heartRate > NORMAL_RANGES.heartRate.max
  ) {
    anomalies.push({
      type: "heartRate",
      value: vitalData.heartRate,
      message: `Heart rate ${vitalData.heartRate} bpm is outside normal range (${NORMAL_RANGES.heartRate.min}-${NORMAL_RANGES.heartRate.max} bpm)`,
    });
  }

  if (
    vitalData.bloodPressure.systolic < NORMAL_RANGES.systolicBP.min ||
    vitalData.bloodPressure.systolic > NORMAL_RANGES.systolicBP.max
  ) {
    anomalies.push({
      type: "bloodPressure.systolic",
      value: vitalData.bloodPressure.systolic,
      message: `Systolic BP ${vitalData.bloodPressure.systolic} mmHg is outside normal range (${NORMAL_RANGES.systolicBP.min}-${NORMAL_RANGES.systolicBP.max} mmHg)`,
    });
  }

  if (
    vitalData.bloodPressure.diastolic < NORMAL_RANGES.diastolicBP.min ||
    vitalData.bloodPressure.diastolic > NORMAL_RANGES.diastolicBP.max
  ) {
    anomalies.push({
      type: "bloodPressure.diastolic",
      value: vitalData.bloodPressure.diastolic,
      message: `Diastolic BP ${vitalData.bloodPressure.diastolic} mmHg is outside normal range (${NORMAL_RANGES.diastolicBP.min}-${NORMAL_RANGES.diastolicBP.max} mmHg)`,
    });
  }

  if (
    vitalData.temperature < NORMAL_RANGES.temperature.min ||
    vitalData.temperature > NORMAL_RANGES.temperature.max
  ) {
    anomalies.push({
      type: "temperature",
      value: vitalData.temperature,
      message: `Temperature ${vitalData.temperature}°C is outside normal range (${NORMAL_RANGES.temperature.min}-${NORMAL_RANGES.temperature.max}°C)`,
    });
  }

  return anomalies.length > 0 ? anomalies : null;
}

module.exports = { detectAnomaly };

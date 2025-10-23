const mongoose = require("mongoose");

const vitalsRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  nurseId: {
    type: String,
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
    min: 0,
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true,
      min: 0,
    },
    diastolic: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  temperature: {
    type: Number,
    required: true,
    min: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VitalsRecord", vitalsRecordSchema);

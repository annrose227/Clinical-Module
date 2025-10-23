require("dotenv").config();
const mongoose = require("mongoose");
const VitalsRecord = require("./models/VitalsRecord");

const testData = [
  {
    patientId: "patient-001",
    nurseId: "nurse-1",
    heartRate: 72,
    bloodPressure: { systolic: 118, diastolic: 78 },
    temperature: 36.6,
  },
  {
    patientId: "patient-001",
    nurseId: "nurse-1",
    heartRate: 75,
    bloodPressure: { systolic: 122, diastolic: 82 },
    temperature: 36.8,
  },
  {
    patientId: "patient-002",
    nurseId: "nurse-2",
    heartRate: 68,
    bloodPressure: { systolic: 115, diastolic: 75 },
    temperature: 36.5,
  },
  {
    patientId: "patient-003",
    nurseId: "nurse-3",
    heartRate: 95, // High heart rate - anomaly
    bloodPressure: { systolic: 150, diastolic: 95 }, // High BP - anomaly
    temperature: 38.2, // High temperature - anomaly
  },
  {
    patientId: "patient-004",
    nurseId: "nurse-4",
    heartRate: 85,
    bloodPressure: { systolic: 135, diastolic: 88 },
    temperature: 37.1,
  },
  {
    patientId: "patient-005",
    nurseId: "nurse-5",
    heartRate: 55, // Low heart rate - anomaly
    bloodPressure: { systolic: 85, diastolic: 55 }, // Low BP - anomaly
    temperature: 36.0, // Low temperature - anomaly
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await VitalsRecord.deleteMany({});
    console.log("Cleared existing vitals data");

    // Insert test data
    await VitalsRecord.insertMany(testData);
    console.log(`Inserted ${testData.length} test vitals records`);

    console.log("Database seeded successfully!");
    console.log(
      "Test data includes normal vitals and some anomalies for testing."
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

seedDatabase();

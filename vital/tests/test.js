const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

jest.setTimeout(10000); // increase timeout for CI / slower machines

describe("Vitals API Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/vitals_test"
    );
  });

  beforeEach(async () => {
    // Clear database before each test
    await VitalsRecord.deleteMany({});
  });

  afterAll(async () => {
    // Close connection
    await mongoose.connection.close();
  });

  describe("GET /api/vitals", () => {
    it("should get all vitals", async () => {
      const response = await request(app).get("/api/vitals");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/vitals", () => {
    it("should create a new vital record", async () => {
      const vital = {
        patientId: "test-patient-1",
        nurseId: "nurse-1",
        heartRate: 75,
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 36.8,
      };

      const response = await request(app).post("/api/vitals").send(vital);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.patientId).toBe(vital.patientId);
    });

    it("should reject invalid data - missing patientId", async () => {
      const invalidVital = {
        nurseId: "nurse-1",
        heartRate: 75,
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 36.8,
      };

      const response = await request(app)
        .post("/api/vitals")
        .send(invalidVital);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject invalid data - invalid heartRate", async () => {
      const invalidVital = {
        patientId: "test-patient-1",
        nurseId: "nurse-1",
        heartRate: "not-a-number",
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 36.8,
      };

      const response = await request(app)
        .post("/api/vitals")
        .send(invalidVital);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should reject invalid data - missing nurseId", async () => {
      const invalidVital = {
        patientId: "test-patient-1",
        heartRate: 75,
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 36.8,
      };

      const response = await request(app)
        .post("/api/vitals")
        .send(invalidVital);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/vitals/:patientId", () => {
    it("should get vitals for specific patient", async () => {
      const vital = new VitalsRecord({
        patientId: "test-patient-2",
        nurseId: "nurse-2",
        heartRate: 80,
        bloodPressure: { systolic: 130, diastolic: 85 },
        temperature: 37.0,
      });

      await vital.save();

      const response = await request(app).get("/api/vitals/test-patient-2");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].patientId).toBe("test-patient-2");
    });
  });
  describe("GET /api/dashboard", () => {
    it("should get dashboard data", async () => {
      const response = await request(app).get("/api/dashboard");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("summary");
      expect(response.body).toHaveProperty("recentVitals");
      expect(response.body).toHaveProperty("alerts");
    });
  });

  describe("GET /api/dashboard/alerts", () => {
    it("should get alerts", async () => {
      const response = await request(app).get("/api/dashboard/alerts");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("Anomaly Detection Integration", () => {
    it("should detect anomalies and send alerts", async () => {
      const anomalousVital = {
        patientId: "anomaly-patient",
        nurseId: "nurse-1",
        heartRate: 150, // High heart rate - anomaly
        bloodPressure: { systolic: 190, diastolic: 120 }, // High BP - anomaly
        temperature: 39.5, // High temperature - anomaly
      };

      const response = await request(app)
        .post("/api/vitals")
        .send(anomalousVital);

      expect(response.status).toBe(201);
      expect(response.body.heartRate).toBe(150);
    });
  });
});

// Teardown: close mongoose and any other clients so Jest can exit cleanly
afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (e) {
    console.warn(
      "Error closing mongoose connection:",
      e && e.message ? e.message : e
    );
  }

  // If server exports redisClient, optionally quit it:
  try {
    const { redisClient } = require("../server");
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (e) {
    // ignore
  }
});

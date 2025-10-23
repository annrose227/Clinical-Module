const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");

describe("Patient History Routes", () => {
  let token;

  beforeAll(() => {
    // Generate a test JWT token
    token = jwt.sign({ id: 1, role: "doctor" }, process.env.JWT_SECRET || "default_secret");
  });

  describe("GET /api/patients/:patientId/history", () => {
    it("should retrieve patient consultation history", async () => {
      // First create some test data
      await request(app).post("/api/consultations").set("Authorization", `Bearer ${token}`).send({
        patientId: "patient123",
        notes: "Initial consultation",
      });

      await request(app)
        .post("/api/prescriptions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          consultationId: 1,
          medications: [
            {
              drugName: "Ibuprofen",
              dosage: "200mg",
              frequency: "three times daily",
              duration: "7 days",
            },
          ],
        });

      await request(app).post("/api/investigations").set("Authorization", `Bearer ${token}`).send({
        consultationId: 1,
        testName: "Blood Pressure Check",
      });

      // Now retrieve history
      const response = await request(app)
        .get("/api/patients/patient123/history")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("consultations");
      expect(response.body).toHaveProperty("prescriptions");
      expect(response.body).toHaveProperty("investigations");
      expect(response.body.consultations).toHaveLength(1);
      expect(response.body.prescriptions).toHaveLength(1);
      expect(response.body.investigations).toHaveLength(1);
    });

    it("should return empty history for patient with no data", async () => {
      const response = await request(app)
        .get("/api/patients/patient999/history")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.consultations).toHaveLength(0);
      expect(response.body.prescriptions).toHaveLength(0);
      expect(response.body.investigations).toHaveLength(0);
    });
  });
});

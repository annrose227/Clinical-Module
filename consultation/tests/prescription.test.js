const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");

// Mock external services
jest.mock("../services/externalServices");

describe("Prescription Routes", () => {
  let token;

  beforeAll(() => {
    // Generate a test JWT token
    token = jwt.sign({ id: 1, role: "doctor" }, process.env.JWT_SECRET || "default_secret");
  });

  describe("POST /api/prescriptions", () => {
    it("should create a new prescription", async () => {
      const prescriptionData = {
        consultationId: 1,
        medications: [
          {
            drugName: "Aspirin",
            dosage: "100mg",
            frequency: "twice daily",
            duration: "7 days",
            brandPreference: "Generic",
          },
        ],
      };

      const response = await request(app)
        .post("/api/prescriptions")
        .set("Authorization", `Bearer ${token}`)
        .send(prescriptionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.consultationId).toBe(prescriptionData.consultationId);
      expect(response.body.medications).toHaveLength(1);
      expect(response.body.status).toBe("draft");
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/prescriptions")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 for empty medications array", async () => {
      const invalidData = {
        consultationId: 1,
        medications: [],
      };

      const response = await request(app)
        .post("/api/prescriptions")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("PUT /api/prescriptions/:id/submit", () => {
    it("should submit a prescription", async () => {
      // First create a prescription
      const createResponse = await request(app)
        .post("/api/prescriptions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          consultationId: 1,
          medications: [
            {
              drugName: "Paracetamol",
              dosage: "500mg",
              frequency: "three times daily",
              duration: "5 days",
            },
          ],
        });

      const prescriptionId = createResponse.body.id;

      // Now submit it
      const response = await request(app)
        .put(`/api/prescriptions/${prescriptionId}/submit`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("submitted");
    });

    it("should return 404 for non-existent prescription", async () => {
      const response = await request(app)
        .put("/api/prescriptions/999/submit")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.status).toBe(404);
    });
  });
});

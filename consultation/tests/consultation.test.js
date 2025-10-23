const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");

// Mock external services
jest.mock("../services/externalServices");

describe("Consultation Routes", () => {
  let token;

  beforeAll(() => {
    // Generate a test JWT token
    token = jwt.sign({ id: 1, role: "doctor" }, process.env.JWT_SECRET || "default_secret");
  });

  describe("POST /api/consultations", () => {
    it("should create a new consultation", async () => {
      const consultationData = {
        patientId: "123",
        notes: "Patient presents with symptoms",
      };

      const response = await request(app)
        .post("/api/consultations")
        .set("Authorization", `Bearer ${token}`)
        .send(consultationData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.patientId).toBe(consultationData.patientId);
      expect(response.body.notes).toBe(consultationData.notes);
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        notes: "Missing patient ID",
      };

      const response = await request(app)
        .post("/api/consultations")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });

    it("should return 401 without token", async () => {
      const consultationData = {
        patientId: "123",
        notes: "Test notes",
      };

      const response = await request(app).post("/api/consultations").send(consultationData);

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /api/consultations/:id", () => {
    it("should update an existing consultation", async () => {
      // First create a consultation
      const createResponse = await request(app)
        .post("/api/consultations")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: "123",
          notes: "Initial notes",
        });

      const consultationId = createResponse.body.id;

      // Now update it
      const updateData = {
        notes: "Updated notes",
        status: "completed",
      };

      const response = await request(app)
        .put(`/api/consultations/${consultationId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.notes).toBe(updateData.notes);
      expect(response.body.status).toBe(updateData.status);
    });

    it("should return 404 for non-existent consultation", async () => {
      const response = await request(app)
        .put("/api/consultations/999")
        .set("Authorization", `Bearer ${token}`)
        .send({ notes: "Test notes" });

      expect(response.status).toBe(404);
    });
  });
});

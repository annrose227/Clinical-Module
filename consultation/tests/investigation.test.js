const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");

describe("Investigation Routes", () => {
  let token;

  beforeAll(() => {
    // Generate a test JWT token
    token = jwt.sign({ id: 1, role: "doctor" }, process.env.JWT_SECRET || "default_secret");
  });

  describe("POST /api/investigations", () => {
    it("should submit an investigation order", async () => {
      const investigationData = {
        consultationId: 1,
        testName: "Blood Test - CBC",
      };

      const response = await request(app)
        .post("/api/investigations")
        .set("Authorization", `Bearer ${token}`)
        .send(investigationData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.consultationId).toBe(investigationData.consultationId);
      expect(response.body.testName).toBe(investigationData.testName);
      expect(response.body.status).toBe("ordered");
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        consultationId: 1,
        // Missing testName
      };

      const response = await request(app)
        .post("/api/investigations")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("GET /api/investigations/:id/results", () => {
    it("should get investigation results", async () => {
      // First create an investigation
      const createResponse = await request(app)
        .post("/api/investigations")
        .set("Authorization", `Bearer ${token}`)
        .send({
          consultationId: 1,
          testName: "X-Ray Chest",
        });

      const investigationId = createResponse.body.id;

      // Now get results
      const response = await request(app)
        .get(`/api/investigations/${investigationId}/results`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", investigationId);
    });

    it("should return 404 for non-existent investigation", async () => {
      const response = await request(app)
        .get("/api/investigations/999/results")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});

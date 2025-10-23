const {
  bedSchema,
  admissionSchema,
} = require("../src/utils/validationSchemas");

// Test Bed Validation
describe("Bed Validation", () => {
  test("should validate a valid bed object", () => {
    const validBed = {
      ward: "Cardiology",
      roomNumber: "101",
      bedNumber: "A1",
      type: "General",
      status: "Available",
    };

    const result = bedSchema.validate(validBed);
    expect(result.error).toBeUndefined();
    expect(result.value.ward).toBe("Cardiology");
  });

  test("should fail validation when required fields are missing", () => {
    const invalidBed = {
      // Missing ward, roomNumber, bedNumber, type
      status: "Available",
    };

    const result = bedSchema.validate(invalidBed);
    expect(result.error).toBeDefined();
    expect(result.error.details.length).toBeGreaterThan(0);
  });

  test("should fail validation for invalid bed type", () => {
    const invalidBed = {
      ward: "Cardiology",
      roomNumber: "101",
      bedNumber: "A1",
      type: "InvalidType",
      status: "Available",
    };

    const result = bedSchema.validate(invalidBed);
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toContain("Type must be one of");
  });

  test("should set default status when not provided", () => {
    const bedWithoutStatus = {
      ward: "Cardiology",
      roomNumber: "101",
      bedNumber: "A1",
      type: "General",
    };

    const result = bedSchema.validate(bedWithoutStatus);
    expect(result.error).toBeUndefined();
    expect(result.value.status).toBe("Available");
  });
});

// Test Admission Validation
describe("Admission Validation", () => {
  test("should validate a valid admission object", () => {
    const validAdmission = {
      patientId: "P12345",
      patientName: "John Doe",
      patientCategory: "Emergency",
      priority: "High",
      bedId: "bed123",
      ward: "Emergency",
      roomNumber: "001",
      bedNumber: "A1",
      admissionReason: "Chest pain",
      attendingPhysician: "Dr. Smith",
    };

    const result = admissionSchema.validate(validAdmission);
    expect(result.error).toBeUndefined();
    expect(result.value.patientName).toBe("John Doe");
  });

  test("should fail validation when required fields are missing", () => {
    const invalidAdmission = {
      patientName: "John Doe",
      // Missing patientId, patientCategory, bedId, etc.
    };

    const result = admissionSchema.validate(invalidAdmission);
    expect(result.error).toBeDefined();
    expect(result.error.details.length).toBeGreaterThan(0);
  });

  test("should fail validation for invalid patient category", () => {
    const invalidAdmission = {
      patientId: "P12345",
      patientName: "John Doe",
      patientCategory: "InvalidCategory",
      bedId: "bed123",
      ward: "Emergency",
      roomNumber: "001",
      bedNumber: "A1",
      admissionReason: "Chest pain",
      attendingPhysician: "Dr. Smith",
    };

    const result = admissionSchema.validate(invalidAdmission);
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toContain(
      "Patient category must be one of"
    );
  });

  test("should set default priority when not provided", () => {
    const admissionWithoutPriority = {
      patientId: "P12345",
      patientName: "John Doe",
      patientCategory: "Scheduled",
      bedId: "bed123",
      ward: "Cardiology",
      roomNumber: "201",
      bedNumber: "B2",
      admissionReason: "Heart surgery",
      attendingPhysician: "Dr. Johnson",
    };

    const result = admissionSchema.validate(admissionWithoutPriority);
    expect(result.error).toBeUndefined();
    expect(result.value.priority).toBe("Medium");
  });

  test("should allow optional diagnosis field", () => {
    const admissionWithDiagnosis = {
      patientId: "P12345",
      patientName: "John Doe",
      patientCategory: "Scheduled",
      bedId: "bed123",
      ward: "Cardiology",
      roomNumber: "201",
      bedNumber: "B2",
      admissionReason: "Heart surgery",
      diagnosis: "Coronary artery disease",
      attendingPhysician: "Dr. Johnson",
    };

    const result = admissionSchema.validate(admissionWithDiagnosis);
    expect(result.error).toBeUndefined();
    expect(result.value.diagnosis).toBe("Coronary artery disease");
  });
});

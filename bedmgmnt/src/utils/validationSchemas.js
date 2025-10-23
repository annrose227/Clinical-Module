const Joi = require("joi");

// Bed validation schemas
const bedSchema = Joi.object({
  ward: Joi.string().trim().required().messages({
    "string.empty": "Ward is required",
    "any.required": "Ward is required",
  }),
  roomNumber: Joi.string().trim().required().messages({
    "string.empty": "Room number is required",
    "any.required": "Room number is required",
  }),
  bedNumber: Joi.string().trim().required().messages({
    "string.empty": "Bed number is required",
    "any.required": "Bed number is required",
  }),
  type: Joi.string().valid("ICU", "General", "Private").required().messages({
    "any.only": "Type must be one of: ICU, General, Private",
    "any.required": "Type is required",
  }),
  status: Joi.string()
    .valid("Available", "Occupied", "Cleaning", "Maintenance", "Reserved")
    .default("Available"),
  assignedPatientId: Joi.string().allow(null).optional(),
  notes: Joi.string().max(500).optional(),
});

// Admission validation schemas
const admissionSchema = Joi.object({
  patientId: Joi.string().trim().required().messages({
    "string.empty": "Patient ID is required",
    "any.required": "Patient ID is required",
  }),
  patientName: Joi.string().trim().required().messages({
    "string.empty": "Patient name is required",
    "any.required": "Patient name is required",
  }),
  patientCategory: Joi.string()
    .valid("Emergency", "Scheduled", "Transfer", "Observation")
    .required()
    .messages({
      "any.only":
        "Patient category must be one of: Emergency, Scheduled, Transfer, Observation",
      "any.required": "Patient category is required",
    }),
  priority: Joi.string()
    .valid("Critical", "High", "Medium", "Low")
    .default("Medium"),
  bedId: Joi.string().required().messages({
    "string.empty": "Bed ID is required",
    "any.required": "Bed ID is required",
  }),
  ward: Joi.string().required().messages({
    "string.empty": "Ward is required",
    "any.required": "Ward is required",
  }),
  roomNumber: Joi.string().required().messages({
    "string.empty": "Room number is required",
    "any.required": "Room number is required",
  }),
  bedNumber: Joi.string().required().messages({
    "string.empty": "Bed number is required",
    "any.required": "Bed number is required",
  }),
  admissionReason: Joi.string().trim().required().messages({
    "string.empty": "Admission reason is required",
    "any.required": "Admission reason is required",
  }),
  diagnosis: Joi.string().trim().optional(),
  attendingPhysician: Joi.string().trim().required().messages({
    "string.empty": "Attending physician is required",
    "any.required": "Attending physician is required",
  }),
});

module.exports = {
  bedSchema,
  admissionSchema,
};

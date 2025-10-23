const express = require('express');
const Joi = require('joi');
const Patient = require('../models/Patient');
const router = express.Router();

// Validation schemas
const newPatientSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  dob: Joi.date().required().max('now'),
  phone: Joi.string().required().pattern(/^\+?[\d\s\-\(\)]{10,15}$/),
  email: Joi.string().email().optional(),
  insurance: Joi.object({
    provider: Joi.string().required(),
    policyNumber: Joi.string().required(),
    groupNumber: Joi.string().optional()
  }).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    relationship: Joi.string().required()
  }).optional()
});

const existingPatientSchema = Joi.object({
  uniqueId: Joi.string().required().pattern(/^PT\d{10}$/)
});

// Register new patient
router.post('/register', async (req, res) => {
  try {
    const { error, value } = newPatientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }
    
    // Check if patient already exists by phone
    const existingPatient = await Patient.findByPhone(value.phone);
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient already exists with this phone number',
        patient: existingPatient.toPublic()
      });
    }
    
    const patient = await Patient.create(value);
    
    // Send welcome SMS to new patient
    try {
      const smsService = require('../services/smsService');
      await smsService.sendWelcomeMessage(patient);
    } catch (smsError) {
      console.error('Welcome SMS error:', smsError);
      // Don't fail registration if SMS fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: patient.toPublic()
    });
    
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Find existing patient
router.post('/find', async (req, res) => {
  try {
    const { error, value } = existingPatientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }
    
    const patient = await Patient.findByUniqueId(value.uniqueId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      patient: patient.toPublic()
    });
    
  } catch (error) {
    console.error('Patient lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient details (for admin)
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      patient: patient.toObject()
    });
    
  } catch (error) {
    console.error('Patient fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update patient information
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    const allowedUpdates = ['name', 'phone', 'email', 'insurance', 'emergencyContact'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    
    await patient.update(updates);
    
    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient: patient.toPublic()
    });
    
  } catch (error) {
    console.error('Patient update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
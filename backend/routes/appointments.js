const express = require('express');
const Joi = require('joi');
const moment = require('moment');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const { generateQRCode, sendConfirmation } = require('../utils/notifications');
const router = express.Router();

// Validation schema
const appointmentSchema = Joi.object({
  patientId: Joi.string().required(),
  doctor: Joi.string().required(),
  department: Joi.string().required(),
  slot: Joi.date().required().min('now'),
  symptoms: Joi.string().required().min(5).max(500),
  urgency: Joi.string().valid('low', 'medium', 'high').default('low'),
  channel: Joi.string().valid('web', 'kiosk', 'whatsapp', 'voice').default('web')
});

// Get available slots for a doctor
router.get('/slots/:doctor', async (req, res) => {
  try {
    const { doctor } = req.params;
    const { date } = req.query;
    
    const targetDate = date ? moment(date) : moment();
    if (!targetDate.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }
    
    // Generate available slots (9 AM to 5 PM, 30-min intervals)
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = moment(targetDate).hour(hour).minute(minute).second(0);
        if (slotTime.isAfter(moment())) { // Only future slots
          slots.push({
            time: slotTime.toDate(),
            available: Math.random() > 0.3 // Mock availability (70% available)
          });
        }
      }
    }
    
    // Get existing appointments for this doctor on this date
    const existingAppointments = await Appointment.findByDoctor(doctor, targetDate.toDate());
    const bookedSlots = existingAppointments.map(apt => moment(apt.slot).format());
    
    // Mark booked slots as unavailable
    slots.forEach(slot => {
      if (bookedSlots.includes(moment(slot.time).format())) {
        slot.available = false;
      }
    });
    
    res.json({
      success: true,
      doctor,
      date: targetDate.format('YYYY-MM-DD'),
      slots: slots.filter(slot => slot.available).slice(0, 20) // Return max 20 slots
    });
    
  } catch (error) {
    console.error('Slots fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Book appointment
router.post('/book', async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }
    
    // Verify patient exists
    const patient = await Patient.findById(value.patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Check slot availability
    const slotTime = moment(value.slot);
    const existingAppointments = await Appointment.findByDoctor(value.doctor, slotTime.toDate());
    const isSlotTaken = existingAppointments.some(apt => 
      moment(apt.slot).format() === slotTime.format() && 
      apt.status !== 'canceled'
    );
    
    if (isSlotTaken) {
      return res.status(409).json({
        success: false,
        message: 'Selected slot is no longer available'
      });
    }
    
    // Create appointment
    const appointmentData = {
      ...value,
      patientName: patient.name,
      status: 'booked'
    };
    
    const appointment = await Appointment.create(appointmentData);
    
    // Generate QR code and send confirmation
    try {
      const qrCode = await generateQRCode(appointment.token);
      await sendConfirmation(patient, appointment, qrCode);
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the appointment booking if notifications fail
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to('queue-updates').emit('appointment-booked', appointment.toPublic());
    io.to('admin-updates').emit('new-appointment', appointment.toPublic());
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: appointment.toPublic()
    });
    
  } catch (error) {
    console.error('Appointment booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get appointment by token
router.get('/token/:token', async (req, res) => {
  try {
    const appointment = await Appointment.findByToken(req.params.token);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      appointment: appointment.toPublic()
    });
    
  } catch (error) {
    console.error('Appointment fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update appointment status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['booked', 'queued', 'in-progress', 'completed', 'canceled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    await appointment.updateStatus(status, notes);
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to('queue-updates').emit('appointment-updated', appointment.toPublic());
    io.to('admin-updates').emit('appointment-status-changed', appointment.toPublic());
    
    res.json({
      success: true,
      message: 'Appointment status updated',
      appointment: appointment.toPublic()
    });
    
  } catch (error) {
    console.error('Appointment update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get patient appointments
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { status } = req.query;
    const appointments = await Appointment.findByPatient(req.params.patientId, status);
    
    res.json({
      success: true,
      appointments: appointments.map(apt => apt.toPublic())
    });
    
  } catch (error) {
    console.error('Patient appointments fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
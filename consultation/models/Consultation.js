// Data model for Consultation
// Using in-memory storage for this example; in production, use a database like MongoDB or PostgreSQL

class Consultation {
  constructor(id, patientId, doctorId, notes, date, status) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.notes = notes;
    this.date = date;
    this.status = status; // e.g., 'active', 'completed'
  }
}

// In-memory storage for consultations
const consultations = [];

module.exports = { Consultation, consultations };

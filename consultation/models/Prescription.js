// Data model for Prescription
// Using in-memory storage for this example; in production, use a database

class Prescription {
  constructor(id, consultationId, medications, status) {
    this.id = id;
    this.consultationId = consultationId;
    this.medications = medications; // Array of medication objects
    this.status = status; // e.g., 'draft', 'submitted', 'filled'
  }
}

class Medication {
  constructor(drugName, dosage, frequency, duration, brandPreference) {
    this.drugName = drugName;
    this.dosage = dosage;
    this.frequency = frequency;
    this.duration = duration;
    this.brandPreference = brandPreference;
  }
}

// In-memory storage
const prescriptions = [];

module.exports = { Prescription, Medication, prescriptions };

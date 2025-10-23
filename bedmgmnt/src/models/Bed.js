const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bedSchema = new mongoose.Schema({
  bedId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  ward: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  bedNumber: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['ICU', 'General', 'Private'],
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved'],
    default: 'Available',
    required: true
  },
  assignedPatientId: {
    type: String,
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Additional fields for enhanced functionality
  equipment: [{
    name: String,
    status: {
      type: String,
      enum: ['Working', 'Maintenance', 'Out of Order'],
      default: 'Working'
    }
  }],
  notes: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bedSchema.index({ ward: 1, roomNumber: 1, bedNumber: 1 }, { unique: true });
bedSchema.index({ status: 1 });
bedSchema.index({ type: 1 });
bedSchema.index({ assignedPatientId: 1 });

// Pre-save middleware to update lastUpdated
bedSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to get available beds by type
bedSchema.statics.getAvailableBedsByType = function(bedType) {
  return this.find({ 
    type: bedType, 
    status: 'Available',
    isActive: true 
  });
};

// Static method to get beds by ward
bedSchema.statics.getBedsByWard = function(wardName) {
  return this.find({ 
    ward: wardName,
    isActive: true 
  }).sort({ roomNumber: 1, bedNumber: 1 });
};

// Instance method to check if bed is available
bedSchema.methods.isAvailable = function() {
  return this.status === 'Available' && this.assignedPatientId === null;
};

// Instance method to assign patient
bedSchema.methods.assignPatient = function(patientId) {
  if (this.isAvailable()) {
    this.assignedPatientId = patientId;
    this.status = 'Occupied';
    this.lastUpdated = new Date();
    return true;
  }
  return false;
};

// Instance method to release bed
bedSchema.methods.releaseBed = function() {
  this.assignedPatientId = null;
  this.status = 'Cleaning';
  this.lastUpdated = new Date();
};

module.exports = mongoose.model('Bed', bedSchema);

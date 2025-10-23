const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const admissionSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  patientId: {
    type: String,
    required: true,
    trim: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientCategory: {
    type: String,
    enum: ['Emergency', 'Scheduled', 'Transfer', 'Observation'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  bedId: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  expectedDischargeDate: {
    type: Date
  },
  actualDischargeDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Discharged', 'Transferred', 'Cancelled'],
    default: 'Active',
    required: true
  },
  admissionReason: {
    type: String,
    required: true,
    trim: true
  },
  diagnosis: {
    type: String,
    trim: true
  },
  attendingPhysician: {
    type: String,
    required: true,
    trim: true
  },
  // Additional fields for enhanced functionality
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    coverageType: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  specialRequirements: [String],
  notes: {
    type: String,
    maxlength: 1000
  },
  // Workflow tracking
  workflowStatus: {
    type: String,
    enum: ['Admitted', 'Under Observation', 'Ready for Discharge', 'Discharged'],
    default: 'Admitted'
  },
  // Transfer information
  transferHistory: [{
    fromBedId: String,
    toBedId: String,
    transferDate: Date,
    reason: String,
    authorizedBy: String
  }],
  // Discharge information
  dischargeInfo: {
    dischargeType: {
      type: String,
      enum: ['Normal', 'Against Medical Advice', 'Transfer to Another Facility', 'Deceased']
    },
    dischargeInstructions: String,
    followUpRequired: Boolean,
    followUpDate: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
admissionSchema.index({ patientId: 1 });
admissionSchema.index({ bedId: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ admissionDate: -1 });
admissionSchema.index({ patientCategory: 1 });
admissionSchema.index({ priority: 1 });

// Static method to get active admissions
admissionSchema.statics.getActiveAdmissions = function() {
  return this.find({ status: 'Active' }).sort({ admissionDate: -1 });
};

// Static method to get admissions by patient
admissionSchema.statics.getAdmissionsByPatient = function(patientId) {
  return this.find({ patientId }).sort({ admissionDate: -1 });
};

// Static method to get admissions by ward
admissionSchema.statics.getAdmissionsByWard = function(wardName) {
  return this.find({ 
    ward: wardName, 
    status: 'Active' 
  }).sort({ admissionDate: -1 });
};

// Static method to get admissions by category
admissionSchema.statics.getAdmissionsByCategory = function(category) {
  return this.find({ 
    patientCategory: category,
    status: 'Active' 
  }).sort({ priority: 1, admissionDate: -1 });
};

// Instance method to check if admission is active
admissionSchema.methods.isActive = function() {
  return this.status === 'Active';
};

// Instance method to discharge patient
admissionSchema.methods.dischargePatient = function(dischargeInfo) {
  if (this.isActive()) {
    this.status = 'Discharged';
    this.actualDischargeDate = new Date();
    this.workflowStatus = 'Discharged';
    if (dischargeInfo) {
      this.dischargeInfo = { ...this.dischargeInfo, ...dischargeInfo };
    }
    return true;
  }
  return false;
};

// Instance method to transfer patient
admissionSchema.methods.transferPatient = function(newBedId, reason, authorizedBy) {
  if (this.isActive()) {
    const transferRecord = {
      fromBedId: this.bedId,
      toBedId: newBedId,
      transferDate: new Date(),
      reason: reason,
      authorizedBy: authorizedBy
    };
    
    this.transferHistory.push(transferRecord);
    this.bedId = newBedId;
    return true;
  }
  return false;
};

// Instance method to update workflow status
admissionSchema.methods.updateWorkflowStatus = function(newStatus) {
  if (this.isActive()) {
    this.workflowStatus = newStatus;
    return true;
  }
  return false;
};

module.exports = mongoose.model('Admission', admissionSchema);

const Admission = require('../models/Admission');
const Bed = require('../models/Bed');
const BedAllocator = require('../utils/bedAllocator');
const { asyncHandler, ValidationError, AdmissionError } = require('../middleware/errorHandler');

// @desc    Get all admissions with filtering and pagination
// @route   GET /api/admissions
// @access  Public
const getAdmissions = asyncHandler(async (req, res) => {
  const { 
    status, 
    patientCategory, 
    priority, 
    ward,
    page = 1, 
    limit = 10, 
    sortBy = 'admissionDate', 
    sortOrder = 'desc' 
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (patientCategory) filter.patientCategory = patientCategory;
  if (priority) filter.priority = priority;
  if (ward) filter.ward = ward;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const admissions = await Admission.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Admission.countDocuments(filter);

  res.json({
    success: true,
    data: admissions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    }
  });
});

// @desc    Get single admission by ID
// @route   GET /api/admissions/:id
// @access  Public
const getAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findOne({ admissionId: req.params.id });
  
  if (!admission) {
    return res.status(404).json({
      success: false,
      message: 'Admission not found'
    });
  }

  res.json({
    success: true,
    data: admission
  });
});

// @desc    Create new admission with smart bed allocation
// @route   POST /api/admissions
// @access  Private (Staff)
const createAdmission = asyncHandler(async (req, res) => {
  const {
    patientId,
    patientName,
    patientCategory,
    priority = 'Medium',
    admissionReason,
    diagnosis,
    attendingPhysician,
    preferredWard,
    specialRequirements = [],
    insuranceInfo,
    emergencyContact,
    expectedDischargeDate,
    notes
  } = req.body;

  // Validate required fields
  if (!patientId || !patientName || !patientCategory || !admissionReason || !attendingPhysician) {
    throw new ValidationError('Patient ID, name, category, admission reason, and attending physician are required');
  }

  // Check if patient already has an active admission
  const existingAdmission = await Admission.findOne({
    patientId,
    status: 'Active'
  });

  if (existingAdmission) {
    return res.status(409).json({
      success: false,
      message: 'Patient already has an active admission',
      data: {
        admissionId: existingAdmission.admissionId,
        bedId: existingAdmission.bedId,
        ward: existingAdmission.ward
      }
    });
  }

  // Smart bed allocation
  const allocationResult = await BedAllocator.allocateBed({
    patientCategory,
    priority,
    specialRequirements,
    preferredWard
  });

  if (!allocationResult.success) {
    return res.status(409).json({
      success: false,
      message: allocationResult.message,
      alternatives: allocationResult.alternatives
    });
  }

  const allocatedBed = allocationResult.bed;

  // Assign patient to bed
  const bedAssigned = allocatedBed.assignPatient(patientId);
  if (!bedAssigned) {
    throw new AdmissionError('Failed to assign patient to bed');
  }

  await allocatedBed.save();

  // Create admission record
  const admission = await Admission.create({
    patientId,
    patientName,
    patientCategory,
    priority,
    bedId: allocatedBed.bedId,
    ward: allocatedBed.ward,
    roomNumber: allocatedBed.roomNumber,
    bedNumber: allocatedBed.bedNumber,
    admissionReason,
    diagnosis,
    attendingPhysician,
    insuranceInfo,
    emergencyContact,
    expectedDischargeDate: expectedDischargeDate ? new Date(expectedDischargeDate) : null,
    notes,
    specialRequirements
  });

  res.status(201).json({
    success: true,
    data: admission,
    message: 'Admission created successfully',
    allocationReason: allocationResult.allocationReason
  });
});

// @desc    Update admission
// @route   PUT /api/admissions/:id
// @access  Private (Staff)
const updateAdmission = asyncHandler(async (req, res) => {
  const admission = await Admission.findOne({ admissionId: req.params.id });

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: 'Admission not found'
    });
  }

  const {
    diagnosis,
    attendingPhysician,
    expectedDischargeDate,
    notes,
    specialRequirements,
    insuranceInfo,
    emergencyContact
  } = req.body;

  // Update fields
  if (diagnosis) admission.diagnosis = diagnosis;
  if (attendingPhysician) admission.attendingPhysician = attendingPhysician;
  if (expectedDischargeDate) admission.expectedDischargeDate = new Date(expectedDischargeDate);
  if (notes !== undefined) admission.notes = notes;
  if (specialRequirements) admission.specialRequirements = specialRequirements;
  if (insuranceInfo) admission.insuranceInfo = insuranceInfo;
  if (emergencyContact) admission.emergencyContact = emergencyContact;

  await admission.save();

  res.json({
    success: true,
    data: admission,
    message: 'Admission updated successfully'
  });
});

// @desc    Discharge patient
// @route   POST /api/admissions/:id/discharge
// @access  Private (Staff)
const dischargePatient = asyncHandler(async (req, res) => {
  const { dischargeType, dischargeInstructions, followUpRequired, followUpDate } = req.body;

  const admission = await Admission.findOne({ admissionId: req.params.id });

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: 'Admission not found'
    });
  }

  if (!admission.isActive()) {
    return res.status(409).json({
      success: false,
      message: 'Admission is not active'
    });
  }

  // Discharge patient
  const discharged = admission.dischargePatient({
    dischargeType,
    dischargeInstructions,
    followUpRequired,
    followUpDate: followUpDate ? new Date(followUpDate) : null
  });

  if (!discharged) {
    throw new AdmissionError('Failed to discharge patient');
  }

  await admission.save();

  // Release bed
  const bed = await Bed.findOne({ bedId: admission.bedId });
  if (bed) {
    bed.releaseBed();
    await bed.save();
  }

  res.json({
    success: true,
    data: admission,
    message: 'Patient discharged successfully'
  });
});

// @desc    Transfer patient to another bed
// @route   POST /api/admissions/:id/transfer
// @access  Private (Staff)
const transferPatient = asyncHandler(async (req, res) => {
  const { newBedId, reason, authorizedBy } = req.body;

  if (!newBedId || !reason || !authorizedBy) {
    throw new ValidationError('New bed ID, reason, and authorized by are required');
  }

  const admission = await Admission.findOne({ admissionId: req.params.id });

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: 'Admission not found'
    });
  }

  if (!admission.isActive()) {
    return res.status(409).json({
      success: false,
      message: 'Admission is not active'
    });
  }

  // Check if new bed is available
  const newBed = await Bed.findOne({ bedId: newBedId, isActive: true });
  if (!newBed) {
    return res.status(404).json({
      success: false,
      message: 'Target bed not found'
    });
  }

  if (!newBed.isAvailable()) {
    return res.status(409).json({
      success: false,
      message: 'Target bed is not available'
    });
  }

  // Get current bed
  const currentBed = await Bed.findOne({ bedId: admission.bedId });

  // Transfer patient
  const transferred = admission.transferPatient(newBedId, reason, authorizedBy);
  if (!transferred) {
    throw new AdmissionError('Failed to transfer patient');
  }

  await admission.save();

  // Update bed assignments
  if (currentBed) {
    currentBed.releaseBed();
    await currentBed.save();
  }

  newBed.assignPatient(admission.patientId);
  await newBed.save();

  res.json({
    success: true,
    data: admission,
    message: 'Patient transferred successfully'
  });
});

// @desc    Update workflow status
// @route   PATCH /api/admissions/:id/workflow
// @access  Private (Staff)
const updateWorkflowStatus = asyncHandler(async (req, res) => {
  const { workflowStatus } = req.body;

  if (!workflowStatus) {
    throw new ValidationError('Workflow status is required');
  }

  const admission = await Admission.findOne({ admissionId: req.params.id });

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: 'Admission not found'
    });
  }

  const updated = admission.updateWorkflowStatus(workflowStatus);
  if (!updated) {
    return res.status(409).json({
      success: false,
      message: 'Cannot update workflow status for inactive admission'
    });
  }

  await admission.save();

  res.json({
    success: true,
    data: admission,
    message: 'Workflow status updated successfully'
  });
});

// @desc    Get active admissions
// @route   GET /api/admissions/active
// @access  Public
const getActiveAdmissions = asyncHandler(async (req, res) => {
  const admissions = await Admission.getActiveAdmissions();

  res.json({
    success: true,
    data: admissions,
    count: admissions.length
  });
});

// @desc    Get admissions by patient
// @route   GET /api/admissions/patient/:patientId
// @access  Public
const getAdmissionsByPatient = asyncHandler(async (req, res) => {
  const admissions = await Admission.getAdmissionsByPatient(req.params.patientId);

  res.json({
    success: true,
    data: admissions,
    patientId: req.params.patientId,
    count: admissions.length
  });
});

// @desc    Get admissions by ward
// @route   GET /api/admissions/ward/:wardName
// @access  Public
const getAdmissionsByWard = asyncHandler(async (req, res) => {
  const admissions = await Admission.getAdmissionsByWard(req.params.wardName);

  res.json({
    success: true,
    data: admissions,
    ward: req.params.wardName,
    count: admissions.length
  });
});

// @desc    Get admissions by category
// @route   GET /api/admissions/category/:category
// @access  Public
const getAdmissionsByCategory = asyncHandler(async (req, res) => {
  const admissions = await Admission.getAdmissionsByCategory(req.params.category);

  res.json({
    success: true,
    data: admissions,
    category: req.params.category,
    count: admissions.length
  });
});

// @desc    Get admission workflow dashboard
// @route   GET /api/admissions/dashboard/workflow
// @access  Public
const getAdmissionWorkflowDashboard = asyncHandler(async (req, res) => {
  const { ward } = req.query;

  const filter = { status: 'Active' };
  if (ward) filter.ward = ward;

  const admissions = await Admission.find(filter)
    .sort({ priority: 1, admissionDate: -1 })
    .select('admissionId patientName patientCategory priority workflowStatus ward bedId admissionDate expectedDischargeDate');

  // Group by workflow status
  const workflowData = admissions.reduce((acc, admission) => {
    if (!acc[admission.workflowStatus]) {
      acc[admission.workflowStatus] = [];
    }
    acc[admission.workflowStatus].push(admission);
    return acc;
  }, {});

  // Calculate statistics
  const stats = {
    total: admissions.length,
    admitted: workflowData['Admitted']?.length || 0,
    underObservation: workflowData['Under Observation']?.length || 0,
    readyForDischarge: workflowData['Ready for Discharge']?.length || 0,
    discharged: workflowData['Discharged']?.length || 0
  };

  res.json({
    success: true,
    data: {
      workflowData,
      stats
    }
  });
});

// @desc    Get real-time bed status tracker
// @route   GET /api/admissions/dashboard/bed-status
// @access  Public
const getBedStatusTracker = asyncHandler(async (req, res) => {
  const { ward } = req.query;

  const filter = { isActive: true };
  if (ward) filter.ward = ward;

  const beds = await Bed.find(filter)
    .sort({ ward: 1, roomNumber: 1, bedNumber: 1 })
    .select('bedId ward roomNumber bedNumber type status assignedPatientId lastUpdated');

  // Get admission details for occupied beds
  const occupiedBedIds = beds.filter(bed => bed.status === 'Occupied').map(bed => bed.bedId);
  const admissions = await Admission.find({
    bedId: { $in: occupiedBedIds },
    status: 'Active'
  }).select('admissionId patientId patientName patientCategory priority admissionDate');

  // Combine bed and admission data
  const bedStatusData = beds.map(bed => {
    const admission = admissions.find(adm => adm.bedId === bed.bedId);
    return {
      ...bed.toObject(),
      admission: admission || null
    };
  });

  res.json({
    success: true,
    data: bedStatusData
  });
});

module.exports = {
  getAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  dischargePatient,
  transferPatient,
  updateWorkflowStatus,
  getActiveAdmissions,
  getAdmissionsByPatient,
  getAdmissionsByWard,
  getAdmissionsByCategory,
  getAdmissionWorkflowDashboard,
  getBedStatusTracker
};

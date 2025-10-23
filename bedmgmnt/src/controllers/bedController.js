const Bed = require('../models/Bed');
const BedAllocator = require('../utils/bedAllocator');
const { asyncHandler, ValidationError } = require('../middleware/errorHandler');

// @desc    Get all beds with filtering and pagination
// @route   GET /api/beds
// @access  Public
const getBeds = asyncHandler(async (req, res) => {
  const { 
    ward, 
    type, 
    status, 
    page = 1, 
    limit = 10, 
    sortBy = 'ward', 
    sortOrder = 'asc' 
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  if (ward) filter.ward = ward;
  if (type) filter.type = type;
  if (status) filter.status = status;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const beds = await Bed.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Bed.countDocuments(filter);

  res.json({
    success: true,
    data: beds,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    }
  });
});

// @desc    Get single bed by ID
// @route   GET /api/beds/:id
// @access  Public
const getBed = asyncHandler(async (req, res) => {
  const bed = await Bed.findOne({ bedId: req.params.id, isActive: true });
  
  if (!bed) {
    return res.status(404).json({
      success: false,
      message: 'Bed not found'
    });
  }

  res.json({
    success: true,
    data: bed
  });
});

// @desc    Create new bed
// @route   POST /api/beds
// @access  Private (Admin)
const createBed = asyncHandler(async (req, res) => {
  const { ward, roomNumber, bedNumber, type, equipment = [], notes } = req.body;

  // Validate required fields
  if (!ward || !roomNumber || !bedNumber || !type) {
    throw new ValidationError('Ward, room number, bed number, and type are required');
  }

  // Check for duplicate bed
  const existingBed = await Bed.findOne({ 
    ward, 
    roomNumber, 
    bedNumber, 
    isActive: true 
  });

  if (existingBed) {
    return res.status(409).json({
      success: false,
      message: 'Bed already exists in this location'
    });
  }

  const bed = await Bed.create({
    ward,
    roomNumber,
    bedNumber,
    type,
    equipment,
    notes
  });

  res.status(201).json({
    success: true,
    data: bed,
    message: 'Bed created successfully'
  });
});

// @desc    Update bed
// @route   PUT /api/beds/:id
// @access  Private (Admin)
const updateBed = asyncHandler(async (req, res) => {
  const bed = await Bed.findOne({ bedId: req.params.id, isActive: true });

  if (!bed) {
    return res.status(404).json({
      success: false,
      message: 'Bed not found'
    });
  }

  const { ward, roomNumber, bedNumber, type, equipment, notes, status } = req.body;

  // Check for duplicate if location is being changed
  if ((ward || roomNumber || bedNumber) && 
      (ward !== bed.ward || roomNumber !== bed.roomNumber || bedNumber !== bed.bedNumber)) {
    const existingBed = await Bed.findOne({
      ward: ward || bed.ward,
      roomNumber: roomNumber || bed.roomNumber,
      bedNumber: bedNumber || bed.bedNumber,
      isActive: true,
      bedId: { $ne: req.params.id }
    });

    if (existingBed) {
      return res.status(409).json({
        success: false,
        message: 'Another bed already exists in this location'
      });
    }
  }

  // Update fields
  if (ward) bed.ward = ward;
  if (roomNumber) bed.roomNumber = roomNumber;
  if (bedNumber) bed.bedNumber = bedNumber;
  if (type) bed.type = type;
  if (equipment) bed.equipment = equipment;
  if (notes !== undefined) bed.notes = notes;
  if (status) bed.status = status;

  await bed.save();

  res.json({
    success: true,
    data: bed,
    message: 'Bed updated successfully'
  });
});

// @desc    Delete bed (soft delete)
// @route   DELETE /api/beds/:id
// @access  Private (Admin)
const deleteBed = asyncHandler(async (req, res) => {
  const bed = await Bed.findOne({ bedId: req.params.id, isActive: true });

  if (!bed) {
    return res.status(404).json({
      success: false,
      message: 'Bed not found'
    });
  }

  // Check if bed is currently occupied
  if (bed.status === 'Occupied') {
    return res.status(409).json({
      success: false,
      message: 'Cannot delete occupied bed. Please discharge patient first.'
    });
  }

  bed.isActive = false;
  bed.status = 'Maintenance';
  await bed.save();

  res.json({
    success: true,
    message: 'Bed deleted successfully'
  });
});

// @desc    Get beds by ward
// @route   GET /api/beds/ward/:wardName
// @access  Public
const getBedsByWard = asyncHandler(async (req, res) => {
  const beds = await Bed.getBedsByWard(req.params.wardName);

  res.json({
    success: true,
    data: beds,
    ward: req.params.wardName,
    count: beds.length
  });
});

// @desc    Get available beds by type
// @route   GET /api/beds/available/:type
// @access  Public
const getAvailableBedsByType = asyncHandler(async (req, res) => {
  const beds = await Bed.getAvailableBedsByType(req.params.type);

  res.json({
    success: true,
    data: beds,
    bedType: req.params.type,
    count: beds.length
  });
});

// @desc    Update bed status
// @route   PATCH /api/beds/:id/status
// @access  Private (Staff)
const updateBedStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  if (!status) {
    throw new ValidationError('Status is required');
  }

  const bed = await Bed.findOne({ bedId: req.params.id, isActive: true });

  if (!bed) {
    return res.status(404).json({
      success: false,
      message: 'Bed not found'
    });
  }

  bed.status = status;
  if (notes) bed.notes = notes;

  await bed.save();

  res.json({
    success: true,
    data: bed,
    message: 'Bed status updated successfully'
  });
});

// @desc    Get bed utilization statistics
// @route   GET /api/beds/stats/utilization
// @access  Public
const getBedUtilizationStats = asyncHandler(async (req, res) => {
  const { ward } = req.query;
  const stats = await BedAllocator.getBedUtilizationStats(ward);

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Predict bed availability
// @route   GET /api/beds/stats/prediction
// @access  Public
const predictBedAvailability = asyncHandler(async (req, res) => {
  const { days = 7, ward } = req.query;
  const predictions = await BedAllocator.predictBedAvailability(parseInt(days), ward);

  res.json({
    success: true,
    data: predictions
  });
});

// @desc    Check bed availability for specific period
// @route   POST /api/beds/:id/availability
// @access  Public
const checkBedAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    throw new ValidationError('Start date and end date are required');
  }

  const availability = await BedAllocator.checkBedAvailability(
    req.params.id,
    new Date(startDate),
    new Date(endDate)
  );

  res.json({
    success: true,
    data: availability
  });
});

// @desc    Get bed mapping dashboard data
// @route   GET /api/beds/dashboard/mapping
// @access  Public
const getBedMappingDashboard = asyncHandler(async (req, res) => {
  const { ward } = req.query;

  const filter = { isActive: true };
  if (ward) filter.ward = ward;

  const beds = await Bed.find(filter)
    .sort({ ward: 1, roomNumber: 1, bedNumber: 1 })
    .select('bedId ward roomNumber bedNumber type status assignedPatientId lastUpdated');

  // Group beds by ward and room
  const mappingData = beds.reduce((acc, bed) => {
    if (!acc[bed.ward]) {
      acc[bed.ward] = {};
    }
    if (!acc[bed.ward][bed.roomNumber]) {
      acc[bed.ward][bed.roomNumber] = [];
    }
    acc[bed.ward][bed.roomNumber].push(bed);
    return acc;
  }, {});

  res.json({
    success: true,
    data: mappingData
  });
});

module.exports = {
  getBeds,
  getBed,
  createBed,
  updateBed,
  deleteBed,
  getBedsByWard,
  getAvailableBedsByType,
  updateBedStatus,
  getBedUtilizationStats,
  predictBedAvailability,
  checkBedAvailability,
  getBedMappingDashboard
};

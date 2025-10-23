const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/bedController');

const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBeds);
router.get('/stats/utilization', getBedUtilizationStats);
router.get('/stats/prediction', predictBedAvailability);
router.get('/dashboard/mapping', getBedMappingDashboard);
router.get('/ward/:wardName', getBedsByWard);
router.get('/available/:type', getAvailableBedsByType);
router.get('/:id', getBed);
router.post('/:id/availability', checkBedAvailability);

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeRoles('admin'), createBed);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateBed);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteBed);
router.patch('/:id/status', authenticateToken, authorizeRoles('admin', 'staff'), updateBedStatus);

module.exports = router;

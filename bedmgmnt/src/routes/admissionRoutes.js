const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/admissionController');

const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAdmissions);
router.get('/active', getActiveAdmissions);
router.get('/patient/:patientId', getAdmissionsByPatient);
router.get('/ward/:wardName', getAdmissionsByWard);
router.get('/category/:category', getAdmissionsByCategory);
router.get('/dashboard/workflow', getAdmissionWorkflowDashboard);
router.get('/dashboard/bed-status', getBedStatusTracker);
router.get('/:id', getAdmission);

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeRoles('admin', 'staff'), createAdmission);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'staff'), updateAdmission);
router.post('/:id/discharge', authenticateToken, authorizeRoles('admin', 'staff'), dischargePatient);
router.post('/:id/transfer', authenticateToken, authorizeRoles('admin', 'staff'), transferPatient);
router.patch('/:id/workflow', authenticateToken, authorizeRoles('admin', 'staff'), updateWorkflowStatus);

module.exports = router;

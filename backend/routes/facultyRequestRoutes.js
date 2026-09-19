import express from 'express';
import {
  createFacultyRequest,
  getMyFacultyRequests,
  getAllFacultyRequests,
  updateFacultyRequestStatus
} from '../controllers/facultyRequestController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Faculty endpoints
router.post('/', authorizeRoles('faculty', 'teacher'), createFacultyRequest);
router.get('/my', authorizeRoles('faculty', 'teacher'), getMyFacultyRequests);

// Admin endpoints
router.get('/all', authorizeRoles('admin'), getAllFacultyRequests);
router.put('/:id/status', authorizeRoles('admin'), updateFacultyRequestStatus);

export default router;

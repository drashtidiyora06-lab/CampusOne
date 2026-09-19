import express from 'express';
import {
  getDrives,
  createDrive,
  applyToDrive,
  updateApplicantStatus,
  getPlacementResources
} from '../controllers/placementController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/drives', getDrives);
router.post('/drives', protect, authorizeRoles('placement_admin', 'admin'), createDrive);
router.post('/drives/:id/apply', protect, authorizeRoles('student'), applyToDrive);
router.put('/drives/:driveId/applicants/:applicantId', protect, authorizeRoles('placement_admin', 'admin'), updateApplicantStatus);
router.get('/resources', getPlacementResources);

export default router;

import express from 'express';
import {
  getDrives,
  createDrive,
  applyToDrive,
  getPlacementResources
} from '../controllers/placementController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/drives', getDrives);
router.post('/drives', protect, authorizeRoles('placement_admin', 'faculty'), createDrive);
router.post('/drives/:id/apply', protect, applyToDrive);
router.get('/resources', getPlacementResources);

export default router;

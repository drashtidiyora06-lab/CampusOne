import express from 'express';
import { getCampusLocations, createCampusLocation } from '../controllers/campusGuideController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampusLocations);
router.post('/', protect, authorizeRoles('faculty', 'placement_admin'), createCampusLocation);

export default router;

import express from 'express';
import { getServiceRequests, createServiceRequest, updateServiceStatus } from '../controllers/serviceController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getServiceRequests);
router.post('/', protect, createServiceRequest);
router.put('/:id/status', protect, authorizeRoles('faculty', 'placement_admin'), updateServiceStatus);

export default router;

import express from 'express';
import { getResources, uploadResource, incrementDownload } from '../controllers/resourceController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getResources);
router.post('/', protect, authorizeRoles('faculty', 'club_admin', 'placement_admin'), uploadResource);
router.put('/:id/download', incrementDownload);

export default router;

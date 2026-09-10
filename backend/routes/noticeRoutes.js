import express from 'express';
import { getNotices, createNotice, deleteNotice } from '../controllers/noticeController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNotices);
router.post('/', protect, authorizeRoles('faculty', 'club_admin', 'placement_admin'), createNotice);
router.delete('/:id', protect, authorizeRoles('faculty', 'club_admin', 'placement_admin'), deleteNotice);

export default router;

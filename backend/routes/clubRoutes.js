import express from 'express';
import { getClubs, getClubById, addClubEvent, joinClub, assignTeacherInCharge } from '../controllers/clubController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClubs);
router.get('/:id', getClubById);
router.post('/:id/events', protect, authorizeRoles('club_admin', 'admin', 'faculty', 'teacher'), addClubEvent);
router.post('/:id/join', protect, authorizeRoles('student'), joinClub);
router.put('/:id/teacher-in-charge', protect, authorizeRoles('admin'), assignTeacherInCharge);

export default router;

import express from 'express';
import { getClubs, getClubById, addClubEvent, joinClub } from '../controllers/clubController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getClubs);
router.get('/:id', getClubById);
router.post('/:id/events', protect, authorizeRoles('club_admin', 'faculty'), addClubEvent);
router.post('/:id/join', protect, joinClub);

export default router;

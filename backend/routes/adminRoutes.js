import express from 'express';
import {
  getAdminStats,
  getUsers,
  createUser,
  toggleUserStatus,
  updateUser,
  createOrUpdateCampusLocation
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id/status', toggleUserStatus);
router.put('/users/:id', updateUser);
router.post('/campus-guide', createOrUpdateCampusLocation);

export default router;

import express from 'express';
import { getTeacherDashboard, getStudentSubmissions, gradeSubmission } from '../controllers/teacherController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('faculty', 'admin'));

router.get('/dashboard', getTeacherDashboard);
router.get('/submissions', getStudentSubmissions);
router.put('/grade', gradeSubmission);

export default router;

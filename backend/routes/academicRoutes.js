import express from 'express';
import {
  getTimetable,
  getSyllabus,
  getAssignments,
  createAssignment,
  submitAssignment,
  getExams,
  getResults
} from '../controllers/academicController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/timetable', getTimetable);
router.get('/syllabus', getSyllabus);
router.get('/assignments', getAssignments);
router.post('/assignments', protect, authorizeRoles('faculty', 'placement_admin'), createAssignment);
router.post('/assignments/:id/submit', protect, submitAssignment);
router.get('/exams', getExams);
router.get('/results', protect, getResults);

export default router;

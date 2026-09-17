import express from 'express';
import { getTeacherDashboard, getStudentSubmissions, gradeSubmission } from '../controllers/teacherController.js';
import {
  getTeachingAssignments,
  getStudentsForAssignment,
  getMarksForAssignment,
  saveBulkMarks
} from '../controllers/academicCoreController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('faculty', 'teacher', 'admin'));

router.get('/dashboard', getTeacherDashboard);
router.get('/submissions', getStudentSubmissions);
router.put('/grade', gradeSubmission);

// Alias routes for V3 Teacher Academic Workflow
router.get('/assignments', getTeachingAssignments);
router.get('/assignments/:assignmentId/students', getStudentsForAssignment);
router.get('/assignments/:assignmentId/marks', getMarksForAssignment);
router.post('/marks', saveBulkMarks);
router.post('/marks/bulk', saveBulkMarks);
router.put('/marks/:id', saveBulkMarks);

export default router;

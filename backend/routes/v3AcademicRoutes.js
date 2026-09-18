import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.js';
import {
  getCourses,
  getSubjects,
  getTeachingAssignments,
  getTeachingAssignmentById,
  getStudentsForAssignment,
  getMarksForAssignment,
  saveBulkMarks,
  getStudentResults,
  getStudentHistoricalResults,
  getAttendanceForAssignment,
  saveAttendance,
  getStudentAttendanceSummary,
  getAdminStats
} from '../controllers/academicCoreController.js';

const router = express.Router();

// Apply auth middleware
router.use(protect);

// Public/Shared read routes
router.get('/courses', getCourses);
router.get('/subjects', getSubjects);
router.get('/teaching-assignments', getTeachingAssignments);
router.get('/teaching-assignments/:assignmentId', getTeachingAssignmentById);
router.get('/teaching-assignments/:assignmentId/students', getStudentsForAssignment);
router.get('/teaching-assignments/:assignmentId/marks', getMarksForAssignment);
router.get('/results', getStudentResults);
router.get('/results/history', getStudentHistoricalResults);

// Attendance routes
router.get('/teaching-assignments/:assignmentId/attendance', authorizeRoles('faculty', 'teacher', 'admin'), getAttendanceForAssignment);
router.post('/teaching-assignments/:assignmentId/attendance', authorizeRoles('faculty', 'teacher', 'admin'), saveAttendance);
router.get('/student/attendance', getStudentAttendanceSummary);

// Teacher & Admin marks submission
router.post('/marks/bulk', authorizeRoles('faculty', 'teacher', 'admin'), saveBulkMarks);
router.post('/marks', authorizeRoles('faculty', 'teacher', 'admin'), saveBulkMarks);
router.put('/marks/:id', authorizeRoles('faculty', 'teacher', 'admin'), saveBulkMarks);

// Admin statistics
router.get('/admin/stats', authorizeRoles('admin'), getAdminStats);

export default router;

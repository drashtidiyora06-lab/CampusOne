import { Assignment, Syllabus } from '../models/Academic.js';
import Resource from '../models/Resource.js';
import { createNotificationHelper } from './notificationController.js';
import User from '../models/User.js';

// GET /api/teacher/dashboard
export const getTeacherDashboard = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    const resources = await Resource.find({ uploadedById: req.user._id });
    const courses = await Syllabus.find({ branch: req.user.branch || 'Computer Science' });

    let totalSubmissions = 0;
    assignments.forEach((a) => {
      totalSubmissions += a.submissions ? a.submissions.length : 0;
    });

    res.json({
      success: true,
      stats: {
        totalAssignments: assignments.length,
        totalResources: resources.length,
        totalCourses: courses.length,
        totalSubmissions
      },
      assignments,
      resources,
      courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teacher/submissions
export const getStudentSubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 });
    const allSubmissions = [];

    assignments.forEach((a) => {
      a.submissions?.forEach((s) => {
        allSubmissions.push({
          assignmentId: a._id,
          assignmentTitle: a.title,
          subject: a.subject,
          maxMarks: a.maxMarks,
          submissionId: s._id,
          studentId: s.studentId,
          studentName: s.studentName,
          submittedAt: s.submittedAt,
          fileUrl: s.fileUrl,
          fileName: s.fileName,
          status: s.status || 'Submitted',
          grade: s.grade || '',
          feedback: s.feedback || ''
        });
      });
    });

    res.json({ success: true, count: allSubmissions.length, submissions: allSubmissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/teacher/submissions/grade
export const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, submissionId, grade, feedback } = req.body;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const sub = assignment.submissions.id(submissionId);
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });

    sub.grade = grade;
    sub.feedback = feedback || 'Graded by instructor';
    sub.status = 'Graded';

    await assignment.save();

    // Trigger notification to student
    if (sub.studentId) {
      await createNotificationHelper({
        userId: sub.studentId,
        title: `Grade Posted: ${assignment.title}`,
        message: `Your instructor graded your submission: ${grade} (${feedback || 'Checked'})`,
        type: 'grade',
        link: '/student/academics'
      });
    }

    res.json({ success: true, message: 'Submission graded successfully', assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

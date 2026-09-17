import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import TeachingAssignment from '../models/TeachingAssignment.js';
import StudentMarks from '../models/StudentMarks.js';
import V3Result from '../models/V3Result.js';
import AssessmentConfig from '../models/AssessmentConfig.js';
import User from '../models/User.js';

// Calculate Best of 3 or Mean ICA and calculate grade
export const calculateSubjectPerformance = (marks, subjectType, hasPractical) => {
  const ica1 = marks?.ica1 !== undefined && marks?.ica1 !== null ? Number(marks.ica1) : null;
  const ica2 = marks?.ica2 !== undefined && marks?.ica2 !== null ? Number(marks.ica2) : null;
  const ica3 = marks?.ica3 !== undefined && marks?.ica3 !== null ? Number(marks.ica3) : null;
  const practical = marks?.practical !== undefined && marks?.practical !== null ? Number(marks.practical) : null;
  const finalExam = marks?.finalExam !== undefined && marks?.finalExam !== null ? Number(marks.finalExam) : null;

  let bestIcaOrMean = 0;
  let maxIcaComponent = 25;

  if (subjectType === 'Major') {
    // Best of 3 ICAs
    const validIcas = [ica1, ica2, ica3].filter((val) => val !== null);
    if (validIcas.length > 0) {
      bestIcaOrMean = Math.max(...validIcas);
    }
  } else {
    // Minor: Mean of ICA 1 and ICA 2
    const validIcas = [ica1, ica2].filter((val) => val !== null);
    if (validIcas.length > 0) {
      const sum = validIcas.reduce((acc, curr) => acc + curr, 0);
      bestIcaOrMean = Math.round((sum / validIcas.length) * 10) / 10;
    }
  }

  // Calculate Total Max & Total Obtained
  let totalMaxMarks = maxIcaComponent + 75; // 25 ICA + 75 Final Exam
  let totalMarksObtained = bestIcaOrMean + (finalExam || 0);

  if (hasPractical) {
    totalMaxMarks += 50; // +50 Practical
    totalMarksObtained += (practical || 0);
  }

  const percentage = Math.round((totalMarksObtained / totalMaxMarks) * 100 * 10) / 10;

  let grade = 'F';
  let status = 'Fail';

  if (percentage >= 85) { grade = 'O'; status = 'Pass'; }
  else if (percentage >= 75) { grade = 'A+'; status = 'Pass'; }
  else if (percentage >= 65) { grade = 'A'; status = 'Pass'; }
  else if (percentage >= 55) { grade = 'B+'; status = 'Pass'; }
  else if (percentage >= 50) { grade = 'B'; status = 'Pass'; }
  else if (percentage >= 45) { grade = 'C'; status = 'Pass'; }
  else if (percentage >= 40) { grade = 'D'; status = 'Pass'; }

  return {
    ica1,
    ica2,
    ica3,
    bestIcaOrMean,
    practical,
    finalExam,
    totalMarksObtained,
    totalMaxMarks,
    percentage,
    grade,
    status
  };
};

// Recalculate Semester Results for all students in a class
export const recalculateClassResults = async (course, semester, division, academicYear = '2026-27') => {
  try {
    // Find all students in this exact academic context
    const students = await User.find({
      role: 'student',
      course,
      semester,
      division
    });

    // Find all subjects for this course and semester
    const subjects = await Subject.find({ course, semester });

    for (const student of students) {
      let subjectResults = [];
      let totalObtained = 0;
      let totalMax = 0;

      for (const subj of subjects) {
        // Find teaching assignment for this subject
        const assignment = await TeachingAssignment.findOne({
          course,
          semester,
          division,
          subject: subj._id,
          academicYear
        });

        let marksRecord = null;
        if (assignment) {
          marksRecord = await StudentMarks.findOne({
            student: student._id,
            teachingAssignment: assignment._id
          });
        }

        const perf = calculateSubjectPerformance(marksRecord, subj.type, subj.hasPractical);

        subjectResults.push({
          subject: subj._id,
          subjectCode: subj.code,
          subjectName: subj.name,
          subjectType: subj.type,
          hasPractical: subj.hasPractical,
          ica1: perf.ica1,
          ica2: perf.ica2,
          ica3: perf.ica3,
          bestIcaOrMean: perf.bestIcaOrMean,
          practical: perf.practical,
          finalExam: perf.finalExam,
          totalMarksObtained: perf.totalMarksObtained,
          totalMaxMarks: perf.totalMaxMarks,
          percentage: perf.percentage,
          grade: perf.grade,
          status: perf.status
        });

        totalObtained += perf.totalMarksObtained;
        totalMax += perf.totalMaxMarks;
      }

      const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100 * 10) / 10 : 0;
      const sgpa = Math.round((overallPercentage / 10) * 100) / 100;
      
      let overallGrade = 'F';
      let overallStatus = 'Fail';
      if (overallPercentage >= 85) { overallGrade = 'O'; overallStatus = 'Pass'; }
      else if (overallPercentage >= 75) { overallGrade = 'A+'; overallStatus = 'Pass'; }
      else if (overallPercentage >= 65) { overallGrade = 'A'; overallStatus = 'Pass'; }
      else if (overallPercentage >= 55) { overallGrade = 'B+'; overallStatus = 'Pass'; }
      else if (overallPercentage >= 50) { overallGrade = 'B'; overallStatus = 'Pass'; }
      else if (overallPercentage >= 45) { overallGrade = 'C'; overallStatus = 'Pass'; }
      else if (overallPercentage >= 40) { overallGrade = 'D'; overallStatus = 'Pass'; }

      await V3Result.findOneAndUpdate(
        { student: student._id, semester, academicYear },
        {
          student: student._id,
          studentIdCode: student.studentId || `STU-${student._id.toString().slice(-4)}`,
          studentName: student.name,
          course,
          semester,
          division,
          academicYear,
          subjectResults,
          totalObtained,
          totalMax,
          overallPercentage,
          sgpa,
          overallGrade,
          overallStatus
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error recalculating results:', error);
  }
};

// Controller Endpoints

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ code: 1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const { course, semester } = req.query;
    let filter = {};
    if (course) filter.course = course.toUpperCase();
    if (semester) filter.semester = Number(semester);

    const subjects = await Subject.find(filter).sort({ course: 1, semester: 1, code: 1 });
    res.json({ success: true, count: subjects.length, subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTeachingAssignments = async (req, res) => {
  try {
    const { teacherId, course, semester, division } = req.query;
    let filter = {};

    // If logged in as teacher and not requesting all explicitly as admin, default filter to teacher
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'teacher') && !teacherId) {
      filter.teacher = req.user._id;
    } else if (teacherId) {
      filter.teacher = teacherId;
    }

    if (course) filter.course = course.toUpperCase();
    if (semester) filter.semester = Number(semester);
    if (division) filter.division = division.toUpperCase();

    const assignments = await TeachingAssignment.find(filter)
      .populate('teacher', 'name email facultyId department')
      .populate('subject', 'name code type hasPractical credits')
      .sort({ course: 1, semester: 1, division: 1, subjectCode: 1 });

    res.json({ success: true, count: assignments.length, assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentsForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await TeachingAssignment.findById(assignmentId).populate('subject');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Teaching assignment not found' });
    }

    // STRICT DATA ISOLATION: Fetch ONLY students with matching course, semester, and division!
    const students = await User.find({
      role: 'student',
      course: assignment.course,
      semester: assignment.semester,
      division: assignment.division
    }).select('_id name email studentId rollNumber course semester division').sort({ rollNumber: 1, name: 1 });

    // Fetch existing marks for this teaching assignment
    const existingMarks = await StudentMarks.find({ teachingAssignment: assignment._id });

    const marksMap = {};
    existingMarks.forEach((m) => {
      marksMap[m.student.toString()] = m;
    });

    const studentList = students.map((s) => ({
      _id: s._id,
      studentId: s.studentId || `STU-${s._id.toString().slice(-4)}`,
      name: s.name,
      email: s.email,
      rollNumber: s.rollNumber || 'N/A',
      marks: marksMap[s._id.toString()] || {
        ica1: null,
        ica2: null,
        ica3: null,
        practical: null,
        finalExam: null
      }
    }));

    res.json({
      success: true,
      assignment: {
        _id: assignment._id,
        teachingAssignmentId: assignment.teachingAssignmentId,
        course: assignment.course,
        semester: assignment.semester,
        division: assignment.division,
        subject: assignment.subject,
        academicYear: assignment.academicYear,
        teacherName: assignment.teacherName
      },
      count: studentList.length,
      students: studentList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveBulkMarks = async (req, res) => {
  try {
    const { assignmentId, assessmentComponent, studentMarks } = req.body;

    if (!assignmentId || !assessmentComponent || !Array.isArray(studentMarks)) {
      return res.status(400).json({ success: false, message: 'Invalid payload provided' });
    }

    const assignment = await TeachingAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Teaching assignment not found' });
    }

    // Teacher authorization check
    if (req.user.role === 'faculty' || req.user.role === 'teacher') {
      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You do not own this teaching assignment' });
      }
    }

    const validComponents = ['ica1', 'ica2', 'ica3', 'practical', 'finalExam'];
    if (!validComponents.includes(assessmentComponent)) {
      return res.status(400).json({ success: false, message: 'Invalid assessment component' });
    }

    // Maximum mark limit check
    let maxLimit = 25;
    if (assessmentComponent === 'practical') maxLimit = 50;
    if (assessmentComponent === 'finalExam') maxLimit = 75;

    let updatedCount = 0;

    for (const item of studentMarks) {
      const { studentId, mark } = item;
      
      let markVal = null;
      if (mark !== '' && mark !== null && mark !== undefined) {
        markVal = Number(mark);
        if (isNaN(markVal) || markVal < 0 || markVal > maxLimit) {
          return res.status(400).json({
            success: false,
            message: `Validation failed: Mark for student must be between 0 and ${maxLimit}`
          });
        }
      }

      await StudentMarks.findOneAndUpdate(
        {
          student: studentId,
          teachingAssignment: assignment._id
        },
        {
          student: studentId,
          teachingAssignment: assignment._id,
          course: assignment.course,
          semester: assignment.semester,
          division: assignment.division,
          subject: assignment.subject,
          teacher: assignment.teacher,
          academicYear: assignment.academicYear,
          [assessmentComponent]: markVal
        },
        { upsert: true, new: true }
      );

      updatedCount++;
    }

    // Recalculate results for class in background / immediately
    await recalculateClassResults(assignment.course, assignment.semester, assignment.division, assignment.academicYear);

    res.json({
      success: true,
      message: `Successfully updated ${assessmentComponent} marks for ${updatedCount} students.`,
      updatedCount
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    let studentId = req.user._id;
    if ((req.user.role === 'admin' || req.user.role === 'faculty') && req.query.studentId) {
      studentId = req.query.studentId;
    }

    const semester = req.query.semester ? Number(req.query.semester) : (req.user.semester || 3);

    const result = await V3Result.findOne({ student: studentId, semester }).populate('student', 'name email studentId rollNumber course semester division');

    if (!result) {
      return res.json({
        success: true,
        result: null,
        message: 'No calculated results found for this semester yet.'
      });
    }

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: { $in: ['faculty', 'teacher'] } });
    const totalCourses = await Course.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalTeachingAssignments = await TeachingAssignment.countDocuments();
    const totalMarksRecords = await StudentMarks.countDocuments();
    const totalResults = await V3Result.countDocuments();

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalSubjects,
        totalTeachingAssignments,
        totalMarksRecords,
        totalResults
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

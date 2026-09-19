import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import TeachingAssignment from '../models/TeachingAssignment.js';
import StudentMarks from '../models/StudentMarks.js';
import V3Result from '../models/V3Result.js';
import AssessmentConfig from '../models/AssessmentConfig.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';

// Calculate Best of 3 (sum of top 2 out of 50) or Mean of 2 (out of 25) ICA and calculate grade
export const calculateSubjectPerformance = (marks, subjectType, hasPractical) => {
  const ica1 = marks?.ica1 !== undefined && marks?.ica1 !== null ? Number(marks.ica1) : null;
  const ica2 = marks?.ica2 !== undefined && marks?.ica2 !== null ? Number(marks.ica2) : null;
  const ica3 = marks?.ica3 !== undefined && marks?.ica3 !== null ? Number(marks.ica3) : null;
  const practical = marks?.practical !== undefined && marks?.practical !== null ? Number(marks.practical) : null;
  const finalExam = marks?.finalExam !== undefined && marks?.finalExam !== null ? Number(marks.finalExam) : null;

  let bestIcaOrMean = 0;
  let maxIcaComponent = 25;
  let consideredIcas = [];

  if (subjectType === 'Major') {
    maxIcaComponent = 50; // Sum of best 2 ICAs (25 + 25)
    const validIcas = [
      { name: 'ICA 1', val: ica1 },
      { name: 'ICA 2', val: ica2 },
      { name: 'ICA 3', val: ica3 }
    ].filter((item) => item.val !== null && !isNaN(item.val));

    // Sort descending by value to get top 2
    validIcas.sort((a, b) => b.val - a.val);

    const top2 = validIcas.slice(0, 2);
    bestIcaOrMean = top2.reduce((acc, curr) => acc + curr.val, 0);
    consideredIcas = top2.map((item) => item.name);
  } else {
    maxIcaComponent = 25; // Average of 2 ICAs
    const validIcas = [
      { name: 'ICA 1', val: ica1 },
      { name: 'ICA 2', val: ica2 }
    ].filter((item) => item.val !== null && !isNaN(item.val));

    if (validIcas.length > 0) {
      const sum = validIcas.reduce((acc, curr) => acc + curr.val, 0);
      bestIcaOrMean = Math.round((sum / validIcas.length) * 10) / 10;
    }
    consideredIcas = validIcas.map((item) => item.name);
  }

  // Calculate Total Max & Total Obtained
  let totalMaxMarks = maxIcaComponent + 75; // 50 (Major) or 25 (Minor) + 75 Final Exam
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
    maxIcaComponent,
    consideredIcas,
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
    const { teacherId, course, semester, division, all } = req.query;
    let filter = {};

    // Teacher authorization: default to authenticated teacher unless explicitly requested by admin
    if (req.user && (req.user.role === 'faculty' || req.user.role === 'teacher') && !all) {
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

export const getTeachingAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await TeachingAssignment.findById(assignmentId)
      .populate('teacher', 'name email facultyId department')
      .populate('subject', 'name code type hasPractical credits');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Teaching assignment not found' });
    }

    res.json({ success: true, assignment });
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

    const studentList = students.map((s) => {
      const m = marksMap[s._id.toString()] || {};
      const perf = calculateSubjectPerformance(m, assignment.subject?.type || 'Major', assignment.subject?.hasPractical || false);

      return {
        _id: s._id,
        studentId: s.studentId || `STU-${s._id.toString().slice(-4)}`,
        name: s.name,
        email: s.email,
        rollNumber: s.rollNumber || 'N/A',
        marks: {
          ica1: m.ica1 !== undefined ? m.ica1 : null,
          ica2: m.ica2 !== undefined ? m.ica2 : null,
          ica3: m.ica3 !== undefined ? m.ica3 : null,
          practical: m.practical !== undefined ? m.practical : null,
          finalExam: m.finalExam !== undefined ? m.finalExam : null
        },
        calculated: perf
      };
    });

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

export const getMarksForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await TeachingAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Teaching assignment not found' });
    }

    const marks = await StudentMarks.find({ teachingAssignment: assignment._id }).populate('student', 'name email studentId rollNumber');
    res.json({ success: true, count: marks.length, marks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Comprehensive Bulk Marks Save/Update Handler
export const saveBulkMarks = async (req, res) => {
  try {
    const { assignmentId, assessmentComponent, studentMarks, fullGrid } = req.body;

    if (!assignmentId || !Array.isArray(studentMarks)) {
      return res.status(400).json({ success: false, message: 'Invalid payload provided' });
    }

    const assignment = await TeachingAssignment.findById(assignmentId).populate('subject');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Teaching assignment not found' });
    }

    // STRICT BACKEND AUTHORIZATION: Verify authenticated teacher owns this assignment
    if (req.user.role === 'faculty' || req.user.role === 'teacher') {
      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: You do not own TeachingAssignment (${assignment.teachingAssignmentId})`
        });
      }
    }

    let updatedCount = 0;

    if (fullGrid) {
      // Save entire mark set per student ({ studentId, ica1, ica2, ica3, practical, finalExam })
      for (const item of studentMarks) {
        const { studentId, ica1, ica2, ica3, practical, finalExam } = item;

        const parseVal = (val, max) => {
          if (val === '' || val === null || val === undefined) return null;
          const num = Number(val);
          if (isNaN(num) || num < 0 || num > max) throw new Error(`Mark value (${val}) out of range (0-${max})`);
          return num;
        };

        const updateData = {
          student: studentId,
          teachingAssignment: assignment._id,
          course: assignment.course,
          semester: assignment.semester,
          division: assignment.division,
          subject: assignment.subject._id || assignment.subject,
          teacher: assignment.teacher,
          academicYear: assignment.academicYear,
          ica1: parseVal(ica1, 25),
          ica2: parseVal(ica2, 25),
          ica3: parseVal(ica3, 25),
          practical: parseVal(practical, 50),
          finalExam: parseVal(finalExam, 75)
        };

        await StudentMarks.findOneAndUpdate(
          { student: studentId, teachingAssignment: assignment._id },
          updateData,
          { upsert: true, new: true }
        );
        updatedCount++;
      }
    } else {
      // Save specific component tab (e.g. ica1, ica2, ica3, practical, finalExam)
      const validComponents = ['ica1', 'ica2', 'ica3', 'practical', 'finalExam'];
      if (!validComponents.includes(assessmentComponent)) {
        return res.status(400).json({ success: false, message: 'Invalid assessment component' });
      }

      let maxLimit = 25;
      if (assessmentComponent === 'practical') maxLimit = 50;
      if (assessmentComponent === 'finalExam') maxLimit = 75;

      for (const item of studentMarks) {
        const { studentId, mark } = item;
        let markVal = null;
        if (mark !== '' && mark !== null && mark !== undefined) {
          markVal = Number(mark);
          if (isNaN(markVal) || markVal < 0 || markVal > maxLimit) {
            return res.status(400).json({
              success: false,
              message: `Validation failed: Mark must be between 0 and ${maxLimit}`
            });
          }
        }

        await StudentMarks.findOneAndUpdate(
          { student: studentId, teachingAssignment: assignment._id },
          {
            student: studentId,
            teachingAssignment: assignment._id,
            course: assignment.course,
            semester: assignment.semester,
            division: assignment.division,
            subject: assignment.subject._id || assignment.subject,
            teacher: assignment.teacher,
            academicYear: assignment.academicYear,
            [assessmentComponent]: markVal
          },
          { upsert: true, new: true }
        );
        updatedCount++;
      }
    }

    // Recalculate results for class in backend
    await recalculateClassResults(assignment.course, assignment.semester, assignment.division, assignment.academicYear);

    res.json({
      success: true,
      message: `Successfully saved marks for ${updatedCount} students. Database and calculated results updated!`,
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

export const getStudentHistoricalResults = async (req, res) => {
  try {
    let studentId = req.user._id;
    if ((req.user.role === 'admin' || req.user.role === 'faculty') && req.query.studentId) {
      studentId = req.query.studentId;
    }

    const results = await V3Result.find({ student: studentId }).sort({ semester: 1 });
    res.json({ success: true, count: results.length, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAttendanceForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { date } = req.query;

    const assignment = await TeachingAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Teaching assignment not found' });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const records = await Attendance.find({
      teachingAssignment: assignment._id,
      date: { $gte: targetDate, $lt: nextDate }
    });

    const recordMap = {};
    records.forEach(r => {
      recordMap[r.student.toString()] = r.status;
    });

    const students = await User.find({
      role: 'student',
      course: assignment.course,
      semester: assignment.semester,
      division: assignment.division
    }).select('_id name studentId rollNumber').sort({ rollNumber: 1 });

    const studentList = students.map(s => ({
      _id: s._id,
      studentId: s.studentId,
      name: s.name,
      rollNumber: s.rollNumber,
      status: recordMap[s._id.toString()] || 'Present'
    }));

    res.json({
      success: true,
      assignment,
      date: targetDate,
      students: studentList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveAttendance = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { date, attendanceData } = req.body; // array of { studentId, status }

    const assignment = await TeachingAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Teaching assignment not found' });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    let updated = 0;
    for (const item of attendanceData) {
      const studentUser = await User.findById(item.studentId).select('name studentId rollNumber');
      await Attendance.findOneAndUpdate(
        {
          student: item.studentId,
          teachingAssignment: assignment._id,
          date: targetDate
        },
        {
          student: item.studentId,
          studentIdCode: studentUser?.studentId || `STU-${item.studentId.toString().slice(-4)}`,
          studentName: studentUser?.name || 'Student',
          teachingAssignment: assignment._id,
          course: assignment.course,
          semester: assignment.semester,
          division: assignment.division,
          subject: assignment.subject,
          subjectCode: assignment.subjectCode,
          subjectName: assignment.subjectName,
          teacher: assignment.teacher,
          academicYear: assignment.academicYear,
          date: targetDate,
          status: item.status || 'Present'
        },
        { upsert: true, new: true }
      );
      updated++;
    }

    res.json({ success: true, message: `Successfully saved attendance for ${updated} students.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentAttendanceSummary = async (req, res) => {
  try {
    let studentId = req.user._id;
    if ((req.user.role === 'admin' || req.user.role === 'faculty') && req.query.studentId) {
      studentId = req.query.studentId;
    }

    const records = await Attendance.find({ student: studentId });

    const subjectStats = {};
    records.forEach(r => {
      const sKey = r.subjectCode || r.subjectName || 'General';
      if (!subjectStats[sKey]) {
        subjectStats[sKey] = { subjectName: r.subjectName || sKey, total: 0, present: 0 };
      }
      subjectStats[sKey].total += 1;
      if (r.status === 'Present') {
        subjectStats[sKey].present += 1;
      }
    });

    const summary = Object.keys(subjectStats).map(sKey => {
      const item = subjectStats[sKey];
      const percentage = item.total > 0 ? Math.round((item.present / item.total) * 100) : 0;
      return {
        subjectCode: sKey,
        subjectName: item.subjectName,
        totalClasses: item.total,
        presentClasses: item.present,
        percentage
      };
    });

    const overallTotal = records.length;
    const overallPresent = records.filter(r => r.status === 'Present').length;
    const overallPercentage = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 85;

    res.json({
      success: true,
      overallPercentage,
      overallTotal,
      overallPresent,
      summary
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


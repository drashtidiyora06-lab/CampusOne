import { Timetable, Syllabus, Assignment, ExamSchedule, Result } from '../models/Academic.js';

// GET /api/academics/timetable
export const getTimetable = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    const timetable = await Timetable.findOne({
      branch: branch || 'Computer Science',
      semester: semester || '6'
    }) || await Timetable.findOne();
    res.json({ success: true, timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/academics/syllabus
export const getSyllabus = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;
    const syllabusList = await Syllabus.find(filter);
    res.json({ success: true, count: syllabusList.length, syllabus: syllabusList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/academics/assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: 1 });
    res.json({ success: true, count: assignments.length, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/academics/assignments (Faculty/Admin)
export const createAssignment = async (req, res) => {
  try {
    const { title, subject, branch, year, dueDate, maxMarks, description } = req.body;
    const assignment = await Assignment.create({
      title,
      subject,
      branch: branch || 'Computer Science',
      year: year || '3rd Year',
      dueDate,
      maxMarks: maxMarks || 100,
      description
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/academics/assignments/:id/submit
export const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const { fileUrl, fileName } = req.body;
    const existingIndex = assignment.submissions.findIndex(
      (sub) => sub.studentId?.toString() === req.user._id.toString()
    );

    const submissionData = {
      studentId: req.user._id,
      studentName: req.user.name,
      submittedAt: new Date(),
      fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: fileName || 'assignment_submission.pdf',
      status: 'Submitted'
    };

    if (existingIndex > -1) {
      assignment.submissions[existingIndex] = submissionData;
    } else {
      assignment.submissions.push(submissionData);
    }

    await assignment.save();
    res.json({ success: true, message: 'Assignment submitted successfully', assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/academics/exams
export const getExams = async (req, res) => {
  try {
    const exams = await ExamSchedule.find();
    res.json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/academics/results
export const getResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user._id }) || await Result.find().limit(1);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

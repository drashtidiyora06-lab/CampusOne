import mongoose from 'mongoose';

// Assignment Schema
const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    branch: { type: String, default: 'Computer Science' },
    year: { type: String, default: '3rd Year' },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    description: { type: String, required: true },
    submissions: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studentName: { type: String },
        submittedAt: { type: Date, default: Date.now },
        fileUrl: { type: String },
        fileName: { type: String },
        status: { type: String, default: 'Submitted' }
      }
    ]
  },
  { timestamps: true }
);

// Timetable Schema
const TimetableSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  schedule: [
    {
      day: { type: String, required: true }, // Monday, Tuesday, etc.
      slots: [
        {
          time: { type: String, required: true }, // e.g. "09:00 AM - 10:00 AM"
          subject: { type: String, required: true },
          code: { type: String },
          instructor: { type: String },
          room: { type: String }
        }
      ]
    }
  ]
});

// Syllabus Schema
const SyllabusSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  code: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  credits: { type: Number, default: 4 },
  modules: [
    {
      title: { type: String, required: true },
      topics: [{ type: String }]
    }
  ]
});

// Exam Schedule & Results Schema
const ExamScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Mid-Semester Examinations Aug 2026"
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  exams: [
    {
      subject: { type: String, required: true },
      code: { type: String },
      date: { type: Date, required: true },
      time: { type: String },
      hall: { type: String }
    }
  ]
});

const ResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber: { type: String, required: true },
  semester: { type: String, required: true },
  cgpa: { type: Number, required: true },
  sgpa: { type: Number, required: true },
  subjects: [
    {
      code: { type: String },
      name: { type: String },
      grade: { type: String }, // A+, A, B+, etc.
      credits: { type: Number }
    }
  ]
});

export const Assignment = mongoose.model('Assignment', AssignmentSchema);
export const Timetable = mongoose.model('Timetable', TimetableSchema);
export const Syllabus = mongoose.model('Syllabus', SyllabusSchema);
export const ExamSchedule = mongoose.model('ExamSchedule', ExamScheduleSchema);
export const Result = mongoose.model('Result', ResultSchema);

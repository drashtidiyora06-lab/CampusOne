import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentIdCode: { type: String },
    studentName: { type: String },
    teachingAssignment: { type: mongoose.Schema.Types.ObjectId, ref: 'TeachingAssignment', required: true },
    course: { type: String, required: true },
    semester: { type: Number, required: true },
    division: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    subjectCode: { type: String },
    subjectName: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    academicYear: { type: String, default: '2026-27' },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
  },
  { timestamps: true }
);

export default mongoose.model('Attendance', AttendanceSchema);

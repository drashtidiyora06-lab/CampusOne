import mongoose from 'mongoose';

const StudentMarksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentIdCode: {
      type: String,
      default: ''
    },
    studentName: {
      type: String,
      default: ''
    },
    teachingAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeachingAssignment',
      required: true
    },
    course: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['BCOM', 'BSCIT', 'BMS', 'BAF', 'BMM']
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    division: {
      type: String,
      required: true,
      enum: ['A', 'B']
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    academicYear: {
      type: String,
      required: true,
      default: '2026-27'
    },
    ica1: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    ica2: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    ica3: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    practical: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    finalExam: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);

// One marks record per student per teaching assignment
StudentMarksSchema.index({ student: 1, teachingAssignment: 1 }, { unique: true });

export default mongoose.model('StudentMarks', StudentMarksSchema);

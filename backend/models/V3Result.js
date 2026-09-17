import mongoose from 'mongoose';

const SubjectResultItemSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  subjectType: { type: String, enum: ['Major', 'Minor'], default: 'Major' },
  hasPractical: { type: Boolean, default: false },
  ica1: { type: Number, default: null },
  ica2: { type: Number, default: null },
  ica3: { type: Number, default: null },
  bestIcaOrMean: { type: Number, default: 0 },
  practical: { type: Number, default: null },
  finalExam: { type: Number, default: null },
  totalMarksObtained: { type: Number, default: 0 },
  totalMaxMarks: { type: Number, default: 100 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: 'F' },
  status: { type: String, enum: ['Pass', 'Fail'], default: 'Fail' }
});

const V3ResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentIdCode: { type: String, default: '' },
    studentName: { type: String, default: '' },
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
    academicYear: {
      type: String,
      required: true,
      default: '2026-27'
    },
    subjectResults: [SubjectResultItemSchema],
    totalObtained: { type: Number, default: 0 },
    totalMax: { type: Number, default: 0 },
    overallPercentage: { type: Number, default: 0 },
    sgpa: { type: Number, default: 0 },
    overallGrade: { type: String, default: 'F' },
    overallStatus: { type: String, enum: ['Pass', 'Fail'], default: 'Fail' }
  },
  { timestamps: true }
);

V3ResultSchema.index({ student: 1, semester: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('V3Result', V3ResultSchema);

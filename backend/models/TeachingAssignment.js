import mongoose from 'mongoose';

const TeachingAssignmentSchema = new mongoose.Schema(
  {
    teachingAssignmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teacherIdCode: {
      type: String,
      default: ''
    },
    teacherName: {
      type: String,
      default: ''
    },
    course: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['BCOM', 'BSCIT', 'BMS', 'BAF', 'BMM', 'MCA', 'MBA', 'MSCIT', 'MCOM']
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
    subjectName: {
      type: String,
      default: ''
    },
    subjectCode: {
      type: String,
      default: ''
    },
    subjectType: {
      type: String,
      enum: ['Major', 'Minor'],
      default: 'Major'
    },
    hasPractical: {
      type: Boolean,
      default: false
    },
    academicYear: {
      type: String,
      required: true,
      default: '2026-27'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

// Uniqueness constraint: A teacher + course + semester + division + subject + academicYear MUST be unique
TeachingAssignmentSchema.index(
  { teacher: 1, course: 1, semester: 1, division: 1, subject: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.model('TeachingAssignment', TeachingAssignmentSchema);

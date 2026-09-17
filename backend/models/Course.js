import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      enum: ['BCOM', 'BSCIT', 'BMS', 'BAF', 'BMM']
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    durationYears: {
      type: Number,
      default: 3
    },
    totalSemesters: {
      type: Number,
      default: 6
    },
    divisions: {
      type: [String],
      default: ['A', 'B']
    }
  },
  { timestamps: true }
);

export default mongoose.model('Course', CourseSchema);

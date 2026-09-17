import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
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
    type: {
      type: String,
      enum: ['Major', 'Minor'],
      default: 'Major'
    },
    hasPractical: {
      type: Boolean,
      default: false
    },
    credits: {
      type: Number,
      default: 4
    }
  },
  { timestamps: true }
);

SubjectSchema.index({ code: 1, course: 1, semester: 1 }, { unique: true });

export default mongoose.model('Subject', SubjectSchema);

import mongoose from 'mongoose';

const PlacementDriveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    logoUrl: { type: String },
    role: { type: String, required: true },
    ctc: { type: String, required: true }, // e.g., "18 LPA"
    location: { type: String, default: 'Bangalore / Remote' },
    minCgpa: { type: Number, default: 7.0 },
    eligibleBranches: [{ type: String }],
    driveDate: { type: Date, required: true },
    deadlineDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'active'
    },
    description: { type: String, required: true },
    applicants: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        studentName: { type: String },
        cgpa: { type: Number },
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, default: 'Applied' } // Applied, Shortlisted, Selected
      }
    ]
  },
  { timestamps: true }
);

const PlacementResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Resume Template', 'Interview Guide', 'Past Experience', 'Aptitude Test'], required: true },
  company: { type: String },
  fileUrl: { type: String, required: true },
  description: { type: String }
});

export const PlacementDrive = mongoose.model('PlacementDrive', PlacementDriveSchema);
export const PlacementResource = mongoose.model('PlacementResource', PlacementResourceSchema);

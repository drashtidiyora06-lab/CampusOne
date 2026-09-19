import mongoose from 'mongoose';

const FacultyRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    facultyId: { type: String, required: true },
    department: { type: String, default: 'General' },
    requestType: {
      type: String,
      enum: [
        'classroom_equipment',
        'lab_equipment',
        'academic_resources',
        'timetable_correction',
        'maintenance',
        'department_request',
        'leave_admin',
        'other'
      ],
      required: true
    },
    subject: { type: String, required: true },
    details: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'approved', 'rejected', 'resolved'],
      default: 'pending'
    },
    adminRemark: { type: String, default: '' },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('FacultyRequest', FacultyRequestSchema);

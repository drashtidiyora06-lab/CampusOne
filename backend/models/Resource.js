import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    semester: { type: String, required: true },
    branch: { type: String, default: 'Computer Science' },
    category: {
      type: String,
      enum: ['Lecture Notes', 'PYQs', 'Lab Manual', 'Reference Book', 'Question Bank'],
      default: 'Lecture Notes'
    },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, default: 'pdf' },
    fileSize: { type: String, default: '2.4 MB' },
    uploadedByName: { type: String, default: 'Faculty Admin' },
    uploadedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    downloadsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Resource', ResourceSchema);

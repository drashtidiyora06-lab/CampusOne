import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    requestType: {
      type: String,
      enum: ['id_card', 'bonafide', 'hostel_complaint', 'fee_receipt', 'general_request', 'general'],
      required: true
    },
    subject: { type: String, required: true },
    details: { type: String, required: true },
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

export default mongoose.model('ServiceRequest', ServiceRequestSchema);

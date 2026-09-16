import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['assignment', 'notice', 'service', 'placement', 'grade', 'system'],
      default: 'system'
    },
    link: { type: String, default: '' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);

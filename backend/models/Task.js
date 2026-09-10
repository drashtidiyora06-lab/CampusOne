import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['academic', 'placement', 'personal', 'project'],
      default: 'personal'
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Task', TaskSchema);

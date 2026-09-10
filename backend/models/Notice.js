import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'placement', 'club', 'general'],
      default: 'general'
    },
    authorName: { type: String, default: 'Campus Admin' },
    authorRole: { type: String, default: 'Admin' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetAudience: { type: String, default: 'All Students' },
    isImportant: { type: Boolean, default: false },
    attachmentUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Notice', NoticeSchema);

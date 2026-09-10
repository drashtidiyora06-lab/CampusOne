import mongoose from 'mongoose';

const CampusGuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['library', 'lab', 'canteen', 'admin', 'hostel', 'sports'],
      required: true
    },
    location: { type: String, required: true },
    timings: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    contact: { type: String },
    email: { type: String },
    description: { type: String, required: true },
    features: [{ type: String }],
    imageUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('CampusGuide', CampusGuideSchema);

import mongoose from 'mongoose';

const CampusGuideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['academic', 'library', 'lab', 'canteen', 'admin', 'hostel', 'sports', 'medical', 'parking', 'services', 'other'],
      required: true
    },
    building: { type: String },
    floor: { type: String },
    roomNumber: { type: String },
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

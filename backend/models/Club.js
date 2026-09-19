import mongoose from 'mongoose';

const ClubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Technical', 'Cultural', 'Sports', 'Literary', 'Social Service'],
      required: true
    },
    description: { type: String, required: true },
    logoUrl: { type: String },
    adminName: { type: String, required: true },
    adminEmail: { type: String },
    teacherInCharge: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    teacherInChargeName: { type: String, default: '' },
    teacherInChargeEmail: { type: String, default: '' },
    clubAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    membersCount: { type: Number, default: 0 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    events: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        venue: { type: String, required: true },
        imageUrl: { type: String },
        registeredCount: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Club', ClubSchema);

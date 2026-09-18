import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin', 'club_admin', 'placement_admin'],
      default: 'student'
    },
    studentId: { type: String, sparse: true, trim: true },
    facultyId: { type: String, sparse: true, trim: true },
    adminId: { type: String, sparse: true, trim: true },
    course: { type: String, default: 'BCOM' },
    semester: { type: Number, default: 3 },
    division: { type: String, default: 'A' },
    department: { type: String, default: 'Computer Science' },
    branch: { type: String, default: 'Computer Science' },
    year: { type: String, default: '3rd Year' },
    rollNumber: { type: String, default: 'CS2026-001' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: 'CampusOne Member' },
    isActive: { type: Boolean, default: true },
    phone: { type: String, default: '' }
  },
  { timestamps: true }
);


// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);

import User from '../models/User.js';
import ServiceRequest from '../models/ServiceRequest.js';
import { PlacementDrive } from '../models/Placement.js';
import Notice from '../models/Notice.js';
import Resource from '../models/Resource.js';
import CampusGuide from '../models/CampusGuide.js';
import { createNotificationHelper } from './notificationController.js';

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const facultyCount = await User.countDocuments({ role: 'faculty' });
    const adminCount = await User.countDocuments({ role: { $in: ['admin', 'club_admin', 'placement_admin'] } });
    const pendingServiceRequests = await ServiceRequest.countDocuments({ status: 'pending' });
    const activeDrives = await PlacementDrive.countDocuments({ status: 'active' });
    const totalNotices = await Notice.countDocuments();
    const totalResources = await Resource.countDocuments();

    res.json({
      success: true,
      stats: {
        studentCount,
        facultyCount,
        adminCount,
        pendingServiceRequests,
        activeDrives,
        totalNotices,
        totalResources
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { facultyId: { $regex: search, $options: 'i' } },
        { adminId: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/users
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, branch, year, rollNumber, studentId, facultyId, adminId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'password123',
      role: role || 'student',
      branch: branch || 'Computer Science',
      year: year || '3rd Year',
      rollNumber: rollNumber || 'CS2026-001',
      studentId: studentId || (role === 'student' ? `STU-${Date.now().toString().slice(-4)}` : undefined),
      facultyId: facultyId || (role === 'faculty' ? `FAC-${Date.now().toString().slice(-4)}` : undefined),
      adminId: adminId || (['admin', 'club_admin', 'placement_admin'].includes(role) ? `ADM-${Date.now().toString().slice(-4)}` : undefined)
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/users/:id/status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `Account ${user.isActive ? 'activated' : 'disabled'} successfully`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    user.branch = req.body.branch || user.branch;
    user.year = req.body.year || user.year;
    user.rollNumber = req.body.rollNumber || user.rollNumber;
    user.studentId = req.body.studentId || user.studentId;
    user.facultyId = req.body.facultyId || user.facultyId;
    user.adminId = req.body.adminId || user.adminId;

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/campus-guide
export const createOrUpdateCampusLocation = async (req, res) => {
  try {
    const { id, name, category, location, timings, isOpen, contact, email, description, features, imageUrl } = req.body;
    let loc;
    if (id) {
      loc = await CampusGuide.findByIdAndUpdate(
        id,
        { name, category, location, timings, isOpen, contact, email, description, features, imageUrl },
        { new: true }
      );
    } else {
      loc = await CampusGuide.create({ name, category, location, timings, isOpen, contact, email, description, features, imageUrl });
    }
    res.json({ success: true, location: loc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

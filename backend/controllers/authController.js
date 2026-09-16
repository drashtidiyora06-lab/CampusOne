import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../middleware/auth.js';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, branch, year, rollNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      branch: branch || 'Computer Science',
      year: year || '3rd Year',
      rollNumber: rollNumber || 'CS2026-001'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        year: user.year,
        rollNumber: user.rollNumber,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token (supports ID or Email)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password, identifier } = req.body;
    const loginQuery = (identifier || email || '').trim();

    if (!loginQuery) {
      return res.status(400).json({ success: false, message: 'Please provide email or user ID' });
    }

    const user = await User.findOne({
      $or: [
        { email: loginQuery.toLowerCase() },
        { studentId: loginQuery },
        { facultyId: loginQuery },
        { adminId: loginQuery },
        { rollNumber: loginQuery }
      ]
    });

    if (user && (await user.matchPassword(password))) {
      if (user.isActive === false) {
        return res.status(403).json({ success: false, message: 'Account disabled. Please contact Admin.' });
      }

      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          facultyId: user.facultyId,
          adminId: user.adminId,
          branch: user.branch,
          year: user.year,
          rollNumber: user.rollNumber,
          avatarUrl: user.avatarUrl,
          bio: user.bio
        }
      });
    }

    res.status(401).json({ success: false, message: 'Invalid credentials. Check ID/Email and password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.branch = req.body.branch || user.branch;
      user.year = req.body.year || user.year;
      user.rollNumber = req.body.rollNumber || user.rollNumber;
      user.bio = req.body.bio || user.bio;
      user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          branch: updatedUser.branch,
          year: updatedUser.year,
          rollNumber: updatedUser.rollNumber,
          avatarUrl: updatedUser.avatarUrl,
          bio: updatedUser.bio
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get demo token for role testing/preview
// @route   POST /api/auth/demo-token
export const getDemoToken = async (req, res) => {

  try {
    const role = req.query.role || req.body.role || 'student';
    let user = await User.findOne({ role });

    if (!user) {
      user = await User.findOne();
    }

    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email: `${role}@college.edu`,
        password: 'password123',
        role,
        branch: 'Computer Science',
        year: '3rd Year',
        rollNumber: 'CS2026-999'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        year: user.year,
        rollNumber: user.rollNumber,
        avatarUrl: user.avatarUrl,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


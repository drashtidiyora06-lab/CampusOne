import FacultyRequest from '../models/FacultyRequest.js';

// Create a new Faculty Administrative Request
export const createFacultyRequest = async (req, res) => {
  try {
    const { requestType, subject, details, priority } = req.body;

    if (!requestType || !subject || !details) {
      return res.status(400).json({ success: false, message: 'Please provide requestType, subject, and details' });
    }

    const newRequest = await FacultyRequest.create({
      userId: req.user._id,
      userName: req.user.name,
      facultyId: req.user.facultyId || req.user.rollNumber || `FAC-${req.user._id.toString().slice(-4)}`,
      department: req.user.department || req.user.branch || 'General',
      requestType,
      subject,
      details,
      priority: priority || 'Medium',
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Faculty request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Faculty's own requests
export const getMyFacultyRequests = async (req, res) => {
  try {
    const requests = await FacultyRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Faculty Requests (Admin only)
export const getAllFacultyRequests = async (req, res) => {
  try {
    const requests = await FacultyRequest.find().populate('userId', 'name email facultyId department').sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Faculty Request Status and Admin Remark (Admin only)
export const updateFacultyRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const request = await FacultyRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Faculty request not found' });
    }

    if (status) request.status = status;
    if (adminRemark !== undefined) request.adminRemark = adminRemark;
    if (['approved', 'rejected', 'resolved'].includes(status)) {
      request.resolvedAt = new Date();
    }

    await request.save();

    res.json({ success: true, message: `Faculty request updated to ${request.status}`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import ServiceRequest from '../models/ServiceRequest.js';
import { createNotificationHelper } from './notificationController.js';

// GET /api/services (Students see own requests, Admins see all)
export const getServiceRequests = async (req, res) => {
  try {
    if (req.user.role === 'faculty' || req.user.role === 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Faculty users do not have access to Student Services. Please use Faculty Requests.'
      });
    }

    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const requests = await ServiceRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/services (Students only create student service requests)
export const createServiceRequest = async (req, res) => {
  try {
    if (req.user.role === 'faculty' || req.user.role === 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Faculty members cannot submit Student Service requests. Please submit a Faculty Request.'
      });
    }

    const { requestType, subject, details } = req.body;
    if (!requestType || !subject || !details) {
      return res.status(400).json({ success: false, message: 'Missing required request fields' });
    }

    const newRequest = await ServiceRequest.create({
      userId: req.user._id,
      userName: req.user.name,
      rollNumber: req.user.rollNumber || req.user.studentId || `STU-${req.user._id.toString().slice(-4)}`,
      requestType,
      subject,
      details,
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Student service request created', request: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/services/:id/status (Admin approval/rejection/processing/resolving)
export const updateServiceStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only Admin can process Student Service Requests' });
    }

    const { status, adminRemark } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (status) request.status = status;
    if (adminRemark !== undefined) request.adminRemark = adminRemark;
    if (['approved', 'rejected', 'resolved'].includes(status)) {
      request.resolvedAt = new Date();
    }

    await request.save();

    // Trigger notification to student
    if (request.userId) {
      await createNotificationHelper({
        userId: request.userId,
        title: `Service Request ${request.status.toUpperCase()}`,
        message: `Your request "${request.subject}" was marked as ${request.status}. Remark: ${request.adminRemark || 'Processed by admin.'}`,
        type: 'service',
        link: '/services'
      });
    }

    res.json({ success: true, message: `Student request updated to ${request.status}`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

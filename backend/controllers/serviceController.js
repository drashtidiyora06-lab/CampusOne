import ServiceRequest from '../models/ServiceRequest.js';

// GET /api/services (User's requests, or all requests if admin)
export const getServiceRequests = async (req, res) => {
  try {
    const filter = ['faculty', 'placement_admin'].includes(req.user.role)
      ? {}
      : { userId: req.user._id };

    const requests = await ServiceRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/services
export const createServiceRequest = async (req, res) => {
  try {
    const { requestType, subject, details } = req.body;
    const newRequest = await ServiceRequest.create({
      userId: req.user._id,
      userName: req.user.name,
      rollNumber: req.user.rollNumber || 'CS2026-001',
      requestType,
      subject,
      details,
      status: 'pending'
    });
    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/services/:id/status (Admin approval/rejection)
export const updateServiceStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    request.status = status || request.status;
    request.adminRemark = adminRemark || request.adminRemark;
    if (status === 'approved' || status === 'rejected') {
      request.resolvedAt = new Date();
    }

    await request.save();
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

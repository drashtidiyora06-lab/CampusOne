import { PlacementDrive, PlacementResource } from '../models/Placement.js';

// GET /api/placements/drives
export const getDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find().sort({ driveDate: 1 });
    res.json({ success: true, count: drives.length, drives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/placements/drives (Placement Cell Admin)
export const createDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.create(req.body);
    res.status(201).json({ success: true, drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/placements/drives/:id/apply
export const applyToDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Placement drive not found' });

    const userIdStr = req.user._id.toString();
    const alreadyApplied = drive.applicants.some((app) => app.studentId?.toString() === userIdStr);

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this company drive' });
    }

    drive.applicants.push({
      studentId: req.user._id,
      studentName: req.user.name,
      cgpa: req.body.cgpa || 8.5,
      appliedAt: new Date(),
      status: 'Applied'
    });

    await drive.save();
    res.json({ success: true, message: 'Application submitted successfully!', drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/placements/resources
export const getPlacementResources = async (req, res) => {
  try {
    const resources = await PlacementResource.find();
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

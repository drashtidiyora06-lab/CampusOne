import CampusGuide from '../models/CampusGuide.js';

// GET /api/campus-guide
export const getCampusLocations = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const locations = await CampusGuide.find(filter);
    res.json({ success: true, count: locations.length, locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/campus-guide (Admin)
export const createCampusLocation = async (req, res) => {
  try {
    const location = await CampusGuide.create(req.body);
    res.status(201).json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

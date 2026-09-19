import Club from '../models/Club.js';
import User from '../models/User.js';

// GET /api/clubs
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('teacherInCharge', 'name email facultyId department')
      .populate('members', 'name email studentId rollNumber course semester division')
      .populate('clubAdmin', 'name email');
    res.json({ success: true, count: clubs.length, clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/clubs/:id
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('teacherInCharge', 'name email facultyId department')
      .populate('members', 'name email studentId rollNumber course semester division')
      .populate('clubAdmin', 'name email');
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
    res.json({ success: true, club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/clubs/:id/events (Club Admins or Admin)
export const addClubEvent = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    const { title, description, date, venue, imageUrl } = req.body;
    club.events.push({
      title,
      description,
      date,
      venue,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60'
    });

    await club.save();
    res.status(201).json({ success: true, club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/clubs/:id/join (Students ONLY)
export const joinClub = async (req, res) => {
  try {
    // STRICT BACKEND AUTHORIZATION: Reject faculty members trying to join as student members
    if (req.user.role === 'faculty' || req.user.role === 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Faculty members serve as Teacher In-Charge / Coordinators and cannot join as student club members.'
      });
    }

    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    const userIdStr = req.user._id.toString();
    const alreadyMember = club.members.some((m) => m.toString() === userIdStr);

    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'Already a member of this club' });
    }

    club.members.push(req.user._id);
    club.membersCount = club.members.length;
    await club.save();

    res.json({ success: true, message: 'Joined club successfully!', club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/clubs/:id/teacher-in-charge (Admin ONLY)
export const assignTeacherInCharge = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only Admin can assign Teacher In-Charge' });
    }

    const { teacherId } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    const teacher = await User.findById(teacherId);
    if (!teacher || (teacher.role !== 'faculty' && teacher.role !== 'teacher')) {
      return res.status(400).json({ success: false, message: 'Invalid faculty user ID provided' });
    }

    club.teacherInCharge = teacher._id;
    club.teacherInChargeName = teacher.name;
    club.teacherInChargeEmail = teacher.email;
    await club.save();

    res.json({ success: true, message: `${teacher.name} assigned as Teacher In-Charge for ${club.name}`, club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

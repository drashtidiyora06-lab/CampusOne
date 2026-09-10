import Club from '../models/Club.js';

// GET /api/clubs
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json({ success: true, count: clubs.length, clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/clubs/:id
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
    res.json({ success: true, club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/clubs/:id/events (Club Admins)
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

// POST /api/clubs/:id/join
export const joinClub = async (req, res) => {
  try {
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

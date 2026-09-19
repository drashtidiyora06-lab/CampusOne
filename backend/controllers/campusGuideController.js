const getCampusLocationImage = (loc) => {
  if (loc.imageUrl && !loc.imageUrl.includes('photo-1521587760476-6c12a4b040da')) {
    return loc.imageUrl;
  }

  const nameLower = (loc.name || '').toLowerCase();
  const catLower = (loc.category || '').toLowerCase();

  if (nameLower.includes('computer') || nameLower.includes('it lab')) {
    return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('science') || nameLower.includes('electronics') || nameLower.includes('chemistry') || nameLower.includes('physics')) {
    return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('auditorium') || nameLower.includes('theater')) {
    return 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('canteen') || nameLower.includes('cafeteria') || catLower === 'canteen') {
    return 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('library') || catLower === 'library') {
    return 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('sports') || nameLower.includes('gym') || catLower === 'sports') {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('hostel') || catLower === 'hostel') {
    return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('medical') || nameLower.includes('health') || catLower === 'medical') {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('parking') || catLower === 'parking') {
    return 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('help desk') || nameLower.includes('services') || catLower === 'services') {
    return 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('placement') || nameLower.includes('career')) {
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('exam') || nameLower.includes('test')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80';
  }
  if (nameLower.includes('academic') || catLower === 'academic') {
    return 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80';
  }
  if (catLower === 'lab') {
    return 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80';
  }
  if (catLower === 'admin') {
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80';
  }

  return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';
};

// GET /api/campus-guide
export const getCampusLocations = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    let locations = await CampusGuide.find(filter);

    // Ensure all locations have category-matched image URLs
    const updatedLocations = [];
    for (const loc of locations) {
      const assignedImage = getCampusLocationImage(loc);
      if (!loc.imageUrl || loc.imageUrl !== assignedImage) {
        loc.imageUrl = assignedImage;
        await loc.save();
      }
      updatedLocations.push(loc);
    }

    res.json({ success: true, count: updatedLocations.length, locations: updatedLocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/campus-guide (Admin)
export const createCampusLocation = async (req, res) => {
  try {
    const locationData = { ...req.body };
    if (!locationData.imageUrl) {
      locationData.imageUrl = getCampusLocationImage(locationData);
    }
    const location = await CampusGuide.create(locationData);
    res.status(201).json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

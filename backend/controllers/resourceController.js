import Resource from '../models/Resource.js';

// GET /api/resources
export const getResources = async (req, res) => {
  try {
    const { subject, semester, category, search } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (semester) filter.semester = semester;
    if (category) filter.category = category;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/resources
export const uploadResource = async (req, res) => {
  try {
    const { title, subject, semester, branch, category, fileUrl, fileName, fileSize } = req.body;
    const resource = await Resource.create({
      title,
      subject,
      semester,
      branch: branch || 'Computer Science',
      category: category || 'Lecture Notes',
      fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileType: 'pdf',
      fileSize: fileSize || '2.5 MB',
      uploadedByName: req.user?.name || 'Faculty Member',
      uploadedById: req.user?._id
    });
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/resources/:id/download
export const incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    resource.downloadsCount += 1;
    await resource.save();
    res.json({ success: true, downloadsCount: resource.downloadsCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

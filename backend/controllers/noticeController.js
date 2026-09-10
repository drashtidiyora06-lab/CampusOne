import Notice from '../models/Notice.js';

// GET /api/notices
export const getNotices = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/notices (Admins/Faculty/Club Admins)
export const createNotice = async (req, res) => {
  try {
    const { title, content, category, targetAudience, isImportant, attachmentUrl } = req.body;
    const notice = await Notice.create({
      title,
      content,
      category,
      targetAudience: targetAudience || 'All Students',
      isImportant: isImportant || false,
      attachmentUrl: attachmentUrl || '',
      authorName: req.user?.name || 'Campus Admin',
      authorRole: req.user?.role || 'Admin',
      authorId: req.user?._id
    });
    res.status(201).json({ success: true, notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/notices/:id
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    await notice.deleteOne();
    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Notification from '../models/Notification.js';

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });
    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    notification.read = true;
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to create notification
export const createNotificationHelper = async ({ userId, title, message, type, link }) => {
  try {
    await Notification.create({ userId, title, message, type, link });
  } catch (err) {
    console.warn('[NotificationHelper] Error:', err.message);
  }
};

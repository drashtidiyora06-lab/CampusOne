import Task from '../models/Task.js';

// GET /api/productivity/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ dueDate: 1, createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/productivity/tasks
export const createTask = async (req, res) => {
  try {
    const { title, category, priority, dueDate } = req.body;
    const task = await Task.create({
      userId: req.user._id,
      title,
      category: category || 'personal',
      priority: priority || 'medium',
      dueDate: dueDate || new Date(Date.now() + 86400000 * 3)
    });
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/productivity/tasks/:id/toggle
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/productivity/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

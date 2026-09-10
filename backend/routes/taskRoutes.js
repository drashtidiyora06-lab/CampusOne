import express from 'express';
import { getTasks, createTask, toggleTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id/toggle', toggleTask);
router.delete('/tasks/:id', deleteTask);

export default router;

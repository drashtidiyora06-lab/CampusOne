import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  CheckSquare,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';

const ProductivityPage = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // New Task state
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'academic',
    priority: 'medium',
    dueDate: ''
  });

  // Pomodoro Study Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // focus (25m), shortBreak (5m), longBreak (15m)

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/productivity/tasks');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.warn('Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/productivity/tasks', newTask);
      if (res.data.success) {
        setShowTaskModal(false);
        setNewTask({ title: '', category: 'academic', priority: 'medium', dueDate: '' });
        fetchTasks();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Task creation failed');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const res = await api.put(`/productivity/tasks/${id}/toggle`);
      if (res.data.success) {
        fetchTasks();
      }
    } catch (err) {
      console.warn('Toggle failed');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await api.delete(`/productivity/tasks/${id}`);
      if (res.data.success) {
        fetchTasks();
      }
    } catch (err) {
      console.warn('Delete failed');
    }
  };

  const setTimerPreset = (mode, mins) => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setTimerSeconds(mins * 60);
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Productivity Suite</h1>
          <p className="page-subtitle">
            Study Pomodoro timer, task manager, academic deadline reminders, and priority planner
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
          <Plus size={18} /> Add New Task
        </button>
      </div>

      <div style={styles.gridContainer}>
        {/* Left Column: Pomodoro Focus Timer */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(99,102,241,0.2) 100%)' }}>
          <div style={styles.timerHeader}>
            <Sparkles size={20} color="#818cf8" />
            <h2 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
              Campus Study Timer
            </h2>
          </div>

          <div style={styles.presetBar}>
            <button
              style={{ ...styles.presetBtn, ...(timerMode === 'focus' ? styles.presetBtnActive : {}) }}
              onClick={() => setTimerPreset('focus', 25)}
            >
              Focus (25m)
            </button>
            <button
              style={{ ...styles.presetBtn, ...(timerMode === 'shortBreak' ? styles.presetBtnActive : {}) }}
              onClick={() => setTimerPreset('shortBreak', 5)}
            >
              Short Break (5m)
            </button>
            <button
              style={{ ...styles.presetBtn, ...(timerMode === 'longBreak' ? styles.presetBtnActive : {}) }}
              onClick={() => setTimerPreset('longBreak', 15)}
            >
              Long Break (15m)
            </button>
          </div>

          <div style={styles.largeTimer}>{formatTimer(timerSeconds)}</div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <button
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
              {isTimerRunning ? 'Pause Session' : 'Start Focus Session'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(25 * 60);
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Right Column: Task Manager */}
        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={20} color="#34d399" />
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0, fontWeight: 700 }}>
                My To-Do Tasks ({tasks.filter((t) => !t.completed).length} Pending)
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map((task) => (
              <div
                key={task._id}
                style={{
                  ...styles.taskRow,
                  ...(task.completed ? styles.taskRowCompleted : {})
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task._id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: task.completed ? '#64748b' : '#f8fafc',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    >
                      {task.title}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                      <span
                        className={`badge ${
                          task.priority === 'high'
                            ? 'badge-red'
                            : task.priority === 'medium'
                            ? 'badge-amber'
                            : 'badge-blue'
                        }`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {task.priority}
                      </span>
                      <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDeleteTask(task._id)}
                  title="Remove Task"
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Add Personal Task
            </h2>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Finish DBMS Module 2 Notes"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  >
                    <option value="academic">Academic</option>
                    <option value="placement">Placement</option>
                    <option value="project">Project</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '1.5rem'
  },
  timerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  presetBar: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  presetBtn: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  presetBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff'
  },
  largeTimer: {
    fontSize: '3.5rem',
    fontWeight: '800',
    textAlign: 'center',
    color: '#ffffff',
    margin: '1.5rem 0',
    letterSpacing: '0.05em'
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.2s ease'
  },
  taskRowCompleted: {
    opacity: 0.6,
    backgroundColor: 'rgba(15, 23, 42, 0.3)'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.35rem'
  }
};

export default ProductivityPage;

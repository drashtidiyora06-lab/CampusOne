import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Bell,
  BookOpen,
  Briefcase,
  Clock,
  ArrowRight,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [drives, setDrives] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Study Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/notices'),
          api.get('/academics/assignments'),
          api.get('/placements/drives'),
          api.get('/services')
        ]);

        const [noticesRes, assignmentsRes, drivesRes, servicesRes] = results;

        if (noticesRes.status === 'fulfilled' && noticesRes.value.data.success) {
          setNotices(noticesRes.value.data.notices.slice(0, 3));
        }
        if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value.data.success) {
          setAssignments(assignmentsRes.value.data.assignments.slice(0, 3));
        }
        if (drivesRes.status === 'fulfilled' && drivesRes.value.data.success) {
          setDrives(drivesRes.value.data.drives.slice(0, 3));
        }
        if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
          setServices(servicesRes.value.data.requests.slice(0, 3));
        }
      } catch (err) {
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div>
          <div style={styles.bannerBadge}>
            <TrendingUp size={14} color="#818cf8" />
            <span>Student Academic Dashboard</span>
          </div>

          <h1 style={styles.bannerTitle}>Welcome back, {user?.name || 'Alex Johnson'}! 👋</h1>

          <p style={styles.bannerText}>
            Student ID: <strong>{user?.studentId || user?.rollNumber || 'STU-2026-101'}</strong> • Dept: <strong>{user?.branch || 'Computer Science'} ({user?.year || '3rd Year'})</strong>
          </p>
        </div>

        <div style={styles.bannerStats}>
          <div style={styles.statBox}>
            <span style={styles.statVal}>8.85</span>
            <span style={styles.statLabel}>Current CGPA</span>
          </div>

          <div style={styles.statBox}>
            <span style={styles.statVal}>94%</span>
            <span style={styles.statLabel}>Attendance</span>
          </div>
        </div>
      </div>

      {/* Grid Overview */}
      <div style={styles.gridContainer}>
        {/* Notices Section */}
        <div className="card">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <Bell size={20} color="#818cf8" />
              <span>Campus Announcements</span>
            </div>

            <Link to="/student/notices" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={styles.listStack}>
            {loading ? (
              <p style={styles.emptyText}>Loading announcements...</p>
            ) : notices.length === 0 ? (
              <p style={styles.emptyText}>No announcements available.</p>
            ) : (
              notices.map((n) => (
                <div key={n._id} style={styles.listItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className={`badge ${n.isImportant ? 'badge-red' : 'badge-indigo'}`}>{n.category}</span>
                    <span style={styles.itemTime}>{new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h4 style={styles.itemTitle}>{n.title}</h4>
                  <p style={styles.itemSnippet}>{n.content ? `${n.content.substring(0, 90)}...` : ''}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Academic Deadlines */}
        <div className="card">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <BookOpen size={20} color="#34d399" />
              <span>Upcoming Deadlines</span>
            </div>

            <Link to="/student/academics" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              Academics <ArrowRight size={14} />
            </Link>
          </div>

          <div style={styles.listStack}>
            {loading ? (
              <p style={styles.emptyText}>Loading deadlines...</p>
            ) : assignments.length === 0 ? (
              <p style={styles.emptyText}>No upcoming deadlines.</p>
            ) : (
              assignments.map((a) => (
                <div key={a._id} style={styles.listItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>{a.subject}</span>
                    <span className="badge badge-amber"><Clock size={12} /> Due {new Date(a.dueDate).toLocaleDateString()}</span>
                  </div>
                  <h4 style={styles.itemTitle}>{a.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    Max Marks: {a.maxMarks} • {a.submissions?.length || 0} Submissions
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Placement Drives Widget */}
        <div className="card">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <Briefcase size={20} color="#fbbf24" />
              <span>Active Placement Drives</span>
            </div>

            <Link to="/student/placements" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              Placements <ArrowRight size={14} />
            </Link>
          </div>

          <div style={styles.listStack}>
            {loading ? (
              <p style={styles.emptyText}>Loading placements...</p>
            ) : drives.length === 0 ? (
              <p style={styles.emptyText}>No active placement drives.</p>
            ) : (
              drives.map((d) => (
                <div key={d._id} style={styles.listItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ ...styles.itemTitle, margin: 0 }}>{d.companyName}</h4>
                    <span className="badge badge-green">{d.ctc}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem' }}>{d.role}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    Min CGPA: {d.minCgpa} • Drive Date: {new Date(d.driveDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Study Timer & Services */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Study Timer Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(99,102,241,0.15) 100%)' }}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <Clock size={20} color="#818cf8" />
                <span>Pomodoro Focus Timer</span>
              </div>
            </div>

            <div style={styles.timerDisplay}>{formatTimer(timerSeconds)}</div>

            <div style={styles.timerControls}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsTimerRunning(!isTimerRunning)}>
                {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                {isTimerRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button className="btn-secondary" onClick={() => { setIsTimerRunning(false); setTimerSeconds(25 * 60); }}>
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Quick Services Status */}
          <div className="card">
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <CheckCircle2 size={18} color="#60a5fa" />
                <span>My Service Requests</span>
              </div>
              <Link to="/student/services" style={{ fontSize: '0.8rem', color: '#60a5fa', textDecoration: 'none' }}>
                Track All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {services.length === 0 ? (
                <p style={styles.emptyText}>No service requests submitted.</p>
              ) : (
                services.map((s) => (
                  <div key={s._id} style={styles.serviceMiniRow}>
                    <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 500 }}>{s.subject}</span>
                    <span className={`badge ${s.status === 'approved' ? 'badge-green' : s.status === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                      {s.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '16px',
    padding: '1.75rem 2rem',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  bannerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#818cf8',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    padding: '0.3rem 0.75rem',
    borderRadius: '9999px',
    marginBottom: '0.5rem'
  },
  bannerTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  bannerText: {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    marginTop: '0.35rem'
  },
  bannerStats: {
    display: 'flex',
    gap: '1.5rem'
  },
  statBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.85rem 1.25rem',
    textAlign: 'center'
  },
  statVal: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  statLabel: {
    fontSize: '0.72rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  listStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  listItem: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '0.85rem'
  },
  itemTitle: {
    fontSize: '0.92rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginTop: '0.35rem'
  },
  itemSnippet: {
    fontSize: '0.82rem',
    color: '#94a3b8',
    marginTop: '0.25rem',
    lineHeight: 1.4
  },
  itemTime: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  emptyText: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '1rem'
  },
  timerDisplay: {
    fontSize: '2.5rem',
    fontWeight: '800',
    textAlign: 'center',
    color: '#ffffff',
    letterSpacing: '0.05em',
    margin: '1rem 0'
  },
  timerControls: {
    display: 'flex',
    gap: '0.75rem'
  },
  serviceMiniRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: '6px'
  }
};

export default StudentDashboardPage;

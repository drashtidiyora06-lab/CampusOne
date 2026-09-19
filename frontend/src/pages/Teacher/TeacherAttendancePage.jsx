import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Save,
  Users,
  Calendar,
  AlertCircle,
  Check,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function TeacherAttendancePage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialAssignmentId = queryParams.get('assignmentId') || '';

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(initialAssignmentId);
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState({}); // { [studentId]: 'Present' | 'Absent' }

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch Teaching Assignments for logged in teacher
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/v3/academics/teaching-assignments');
        if (res.data.success && res.data.assignments) {
          setAssignments(res.data.assignments);
          if (initialAssignmentId && res.data.assignments.some((a) => a._id === initialAssignmentId)) {
            setSelectedAssignmentId(initialAssignmentId);
          } else if (res.data.assignments.length > 0) {
            setSelectedAssignmentId(res.data.assignments[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
        showToast('Failed to load teaching assignments', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user, initialAssignmentId]);

  // Fetch students & attendance for selected assignment and date
  useEffect(() => {
    if (!selectedAssignmentId) return;

    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/v3/academics/teaching-assignments/${selectedAssignmentId}/attendance?date=${date}`);
        if (res.data.success) {
          setAssignmentDetails(res.data.assignment);
          setStudents(res.data.students || []);

          const initialAtt = {};
          (res.data.students || []).forEach((s) => {
            initialAtt[s._id] = s.status || 'Present';
          });
          setAttendanceState(initialAtt);
        }
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        showToast('Failed to fetch attendance data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedAssignmentId, date]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleStatusToggle = (studentId, newStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = async () => {
    if (!selectedAssignmentId) return;

    try {
      setSaving(true);
      const attendanceData = students.map((s) => ({
        studentId: s._id,
        status: attendanceState[s._id] || 'Present'
      }));

      const res = await api.post(`/v3/academics/teaching-assignments/${selectedAssignmentId}/attendance`, {
        date,
        attendanceData
      });

      if (res.data.success) {
        showToast(res.data.message || 'Attendance saved successfully to database!');
      } else {
        showToast(res.data.message || 'Failed to save attendance', 'error');
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      showToast(err.response?.data?.message || 'Error saving attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const totalStudents = students.length;
  const presentCount = Object.values(attendanceState).filter((s) => s === 'Present').length;
  const absentCount = totalStudents - presentCount;
  const attendancePct = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div style={styles.container}>
      {/* Toast */}
      {toast.show && (
        <div style={{ ...styles.toast, backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981' }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            <Clock size={14} /> FACULTY ATTENDANCE MANAGEMENT
          </div>
          <h1 style={styles.title}>Mark & Track Class Attendance</h1>
          <p style={styles.subtitle}>
            Data-isolated attendance marking for assigned course, semester, division, and subject.
          </p>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div style={styles.toolbarCard}>
        <div style={styles.toolbarGrid}>
          {/* Assignment Dropdown */}
          <div style={styles.field}>
            <label style={styles.label}>Select Teaching Assignment</label>
            <select
              style={styles.select}
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
            >
              {assignments.map((ta) => (
                <option key={ta._id} value={ta._id}>
                  {ta.course} Sem {ta.semester} Div {ta.division} — {ta.subjectCode}: {ta.subjectName || ta.subject?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div style={styles.field}>
            <label style={styles.label}>Attendance Date</label>
            <input
              type="date"
              style={styles.inputDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Selected Context Banner */}
        {assignmentDetails && (
          <div style={styles.contextBanner}>
            <div style={styles.ctxBadge}>COURSE: {assignmentDetails.course}</div>
            <div style={styles.ctxBadge}>SEMESTER: {assignmentDetails.semester}</div>
            <div style={styles.ctxBadge}>DIVISION: {assignmentDetails.division}</div>
            <div style={styles.ctxBadgeHighlight}>SUBJECT: {assignmentDetails.subjectCode || assignmentDetails.subject?.code} - {assignmentDetails.subjectName || assignmentDetails.subject?.name}</div>
          </div>
        )}
      </div>

      {/* Attendance Stats Overview */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <Users size={20} color="#818cf8" />
          <div>
            <div style={styles.statVal}>{totalStudents}</div>
            <div style={styles.statLabel}>Total Students</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <CheckCircle2 size={20} color="#34d399" />
          <div>
            <div style={{ ...styles.statVal, color: '#34d399' }}>{presentCount}</div>
            <div style={styles.statLabel}>Present</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <XCircle size={20} color="#f87171" />
          <div>
            <div style={{ ...styles.statVal, color: '#f87171' }}>{absentCount}</div>
            <div style={styles.statLabel}>Absent</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <Clock size={20} color="#fbbf24" />
          <div>
            <div style={{ ...styles.statVal, color: '#fbbf24' }}>{attendancePct}%</div>
            <div style={styles.statLabel}>Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Main Student List & Action Card */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="#818cf8" />
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#f8fafc' }}>
              Class Roll Call & Attendance Marking ({date})
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={styles.btnSecondary} onClick={() => handleMarkAll('Present')}>
              <Check size={14} /> Mark All Present
            </button>
            <button style={styles.btnSecondaryDanger} onClick={() => handleMarkAll('Absent')}>
              <X size={14} /> Mark All Absent
            </button>
            <button style={styles.btnPrimary} onClick={handleSaveAttendance} disabled={saving}>
              <Save size={16} /> {saving ? 'Saving to DB...' : 'Save Attendance'}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>Fetching students for selected teaching assignment...</div>
        ) : students.length === 0 ? (
          <div style={styles.emptyBox}>No enrolled students found for this class assignment.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Roll No.</th>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action Toggle</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => {
                  const currentStatus = attendanceState[st._id] || 'Present';
                  const isPresent = currentStatus === 'Present';

                  return (
                    <tr key={st._id} style={styles.tr}>
                      <td style={styles.tdCode}>{st.rollNumber || 'N/A'}</td>
                      <td style={styles.tdCode}>{st.studentId || 'STU-101'}</td>
                      <td style={styles.tdName}>{st.name}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: isPresent ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isPresent ? '#4ade80' : '#f87171'
                          }}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            style={{
                              ...styles.toggleBtn,
                              backgroundColor: isPresent ? '#22c55e' : '#334155',
                              color: '#ffffff'
                            }}
                            onClick={() => handleStatusToggle(st._id, 'Present')}
                          >
                            <Check size={14} /> Present
                          </button>
                          <button
                            style={{
                              ...styles.toggleBtn,
                              backgroundColor: !isPresent ? '#ef4444' : '#334155',
                              color: '#ffffff'
                            }}
                            onClick={() => handleStatusToggle(st._id, 'Absent')}
                          >
                            <X size={14} /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1280px', margin: '0 auto', color: '#f8fafc' },
  toast: { position: 'fixed', top: '1.5rem', right: '1.5rem', padding: '0.85rem 1.25rem', borderRadius: '8px', color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' },
  header: { marginBottom: '1.5rem' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '0.5rem' },
  title: { fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: 0 },
  subtitle: { fontSize: '0.95rem', color: '#94a3b8', marginTop: '0.35rem' },
  toolbarCard: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' },
  toolbarGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' },
  select: { padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', width: '100%' },
  inputDate: { padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', width: '100%' },
  contextBanner: { display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' },
  ctxBadge: { fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' },
  ctxBadgeHighlight: { fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { backgroundColor: '#1e293b', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '1rem' },
  statVal: { fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' },
  statLabel: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.1rem' },
  tableCard: { backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  loadingBox: { textAlign: 'center', padding: '3rem', color: '#94a3b8' },
  emptyBox: { textAlign: 'center', padding: '3rem', color: '#94a3b8' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  tdCode: { padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', fontFamily: 'monospace' },
  tdName: { padding: '0.85rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' },
  td: { padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#cbd5e1' },
  statusBadge: { fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px' },
  toggleBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', borderRadius: '6px', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
  btnSecondaryDanger: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }
};

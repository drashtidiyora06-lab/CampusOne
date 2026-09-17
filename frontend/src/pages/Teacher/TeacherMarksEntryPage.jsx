import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Save,
  Users,
  Award,
  Layers,
  Sparkles,
  Info,
  Check,
  RefreshCw
} from 'lucide-react';

export default function TeacherMarksEntryPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [component, setComponent] = useState('ica1');
  const [marksState, setMarksState] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [validationError, setValidationError] = useState('');

  // Fetch teaching assignments for teacher
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/v3/academics/teaching-assignments');
        if (res.data.success && res.data.assignments) {
          setAssignments(res.data.assignments);
          if (res.data.assignments.length > 0) {
            setSelectedAssignmentId(res.data.assignments[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching teaching assignments:', err);
        showToast('Failed to load teaching assignments', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  // Fetch students & marks when selected assignment changes
  useEffect(() => {
    if (!selectedAssignmentId) return;

    const fetchClassData = async () => {
      try {
        setLoading(true);
        setValidationError('');
        const res = await api.get(`/v3/academics/teaching-assignments/${selectedAssignmentId}/students`);
        if (res.data.success) {
          setAssignmentDetails(res.data.assignment);
          setStudents(res.data.students);

          // Populate local state for marks
          const initialMarks = {};
          res.data.students.forEach((s) => {
            initialMarks[s._id] = s.marks[component] !== null && s.marks[component] !== undefined ? s.marks[component] : '';
          });
          setMarksState(initialMarks);
        }
      } catch (err) {
        console.error('Error fetching student class list:', err);
        showToast('Failed to fetch class students list', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [selectedAssignmentId]);

  // Update marksState when active assessment component tab changes
  useEffect(() => {
    if (!students || students.length === 0) return;
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = s.marks[component] !== null && s.marks[component] !== undefined ? s.marks[component] : '';
    });
    setMarksState(updated);
    setValidationError('');
  }, [component, students]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleMarkChange = (studentId, val) => {
    setValidationError('');
    setMarksState((prev) => ({
      ...prev,
      [studentId]: val
    }));
  };

  const getMaxMarkLimit = () => {
    if (component === 'practical') return 50;
    if (component === 'finalExam') return 75;
    return 25; // ICAs max 25
  };

  const handleSaveMarks = async () => {
    const maxLimit = getMaxMarkLimit();
    setValidationError('');

    // Client-side validation
    const payloadMarks = [];
    for (const s of students) {
      const val = marksState[s._id];
      if (val !== '' && val !== null && val !== undefined) {
        const num = Number(val);
        if (isNaN(num) || num < 0 || num > maxLimit) {
          const err = `Invalid Mark for ${s.name} (${val}). Must be between 0 and ${maxLimit}.`;
          setValidationError(err);
          showToast(err, 'error');
          return;
        }
        payloadMarks.push({ studentId: s._id, mark: num });
      } else {
        payloadMarks.push({ studentId: s._id, mark: null });
      }
    }

    try {
      setSaving(true);
      const res = await api.post('/v3/academics/marks/bulk', {
        assignmentId: selectedAssignmentId,
        assessmentComponent: component,
        studentMarks: payloadMarks
      });

      if (res.data.success) {
        showToast(res.data.message || 'Marks saved and results updated successfully!');
        // Refresh local student data
        const refRes = await api.get(`/v3/academics/teaching-assignments/${selectedAssignmentId}/students`);
        if (refRes.data.success) {
          setStudents(refRes.data.students);
        }
      }
    } catch (err) {
      console.error('Error saving marks:', err);
      showToast(err.response?.data?.message || 'Failed to save marks', 'error');
    } finally {
      setSaving(false);
    }
  };

  const subjectType = assignmentDetails?.subject?.type || 'Major';
  const hasPractical = assignmentDetails?.subject?.hasPractical || false;

  return (
    <div style={styles.container}>
      {/* Toast Alert */}
      {toast.show && (
        <div style={{ ...styles.toast, backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981' }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            <Award size={14} /> CAMPUSONE V3 EXAMINATION SYSTEM
          </div>
          <h1 style={styles.title}>Teacher Marks Entry & Assessment Management</h1>
          <p style={styles.subtitle}>
            Enter, validate, and compute official assessment components with strict academic context isolation.
          </p>
        </div>
      </div>

      {/* Assignment Selection Bar */}
      <div style={styles.selectorCard}>
        <div style={styles.selectorGroup}>
          <label style={styles.label}>
            <BookOpen size={16} color="#818cf8" /> Select Teaching Assignment:
          </label>
          <select
            style={styles.select}
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
          >
            {assignments.map((ta) => (
              <option key={ta._id} value={ta._id}>
                {ta.course} / Sem {ta.semester} / Div {ta.division} — {ta.subjectCode}: {ta.subjectName} ({ta.subjectType || 'Major'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Context Banner */}
      {assignmentDetails && (
        <div style={styles.contextBanner}>
          <div style={styles.contextGrid}>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>COURSE</span>
              <span style={styles.contextVal}>{assignmentDetails.course}</span>
            </div>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>SEMESTER</span>
              <span style={styles.contextVal}>Semester {assignmentDetails.semester}</span>
            </div>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>DIVISION</span>
              <span style={styles.contextVal}>Division {assignmentDetails.division}</span>
            </div>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>SUBJECT</span>
              <span style={styles.contextVal}>{assignmentDetails.subject?.name || assignmentDetails.subjectName} ({assignmentDetails.subject?.code})</span>
            </div>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>EVALUATION RULE</span>
              <span style={{ ...styles.contextVal, color: '#a7f3d0' }}>
                {subjectType === 'Major' ? 'Best of 3 ICAs (25M)' : 'ICA Mean of 2 (25M)'}
              </span>
            </div>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>PRACTICAL</span>
              <span style={{ ...styles.contextVal, color: hasPractical ? '#fef08a' : '#94a3b8' }}>
                {hasPractical ? 'Available (50M)' : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Component Tabs */}
      <div style={styles.tabsRow}>
        <button
          style={{ ...styles.tabBtn, ...(component === 'ica1' ? styles.tabBtnActive : {}) }}
          onClick={() => setComponent('ica1')}
        >
          ICA 1 (25 Marks)
        </button>
        <button
          style={{ ...styles.tabBtn, ...(component === 'ica2' ? styles.tabBtnActive : {}) }}
          onClick={() => setComponent('ica2')}
        >
          ICA 2 (25 Marks)
        </button>

        {subjectType === 'Major' ? (
          <button
            style={{ ...styles.tabBtn, ...(component === 'ica3' ? styles.tabBtnActive : {}) }}
            onClick={() => setComponent('ica3')}
          >
            ICA 3 (25 Marks)
          </button>
        ) : (
          <button style={{ ...styles.tabBtn, opacity: 0.4, cursor: 'not-allowed' }} title="Minor subjects use 2 ICAs">
            ICA 3 (Disabled - Minor Subject)
          </button>
        )}

        {hasPractical ? (
          <button
            style={{ ...styles.tabBtn, ...(component === 'practical' ? styles.tabBtnActive : {}) }}
            onClick={() => setComponent('practical')}
          >
            Practical Exam (50 Marks)
          </button>
        ) : (
          <button style={{ ...styles.tabBtn, opacity: 0.4, cursor: 'not-allowed' }} title="Practical not applicable for this subject">
            Practical (N/A)
          </button>
        )}

        <button
          style={{ ...styles.tabBtn, ...(component === 'finalExam' ? styles.tabBtnActive : {}) }}
          onClick={() => setComponent('finalExam')}
        >
          Final Semester Exam (75 Marks)
        </button>
      </div>

      {/* Validation Warning */}
      {validationError && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Student List Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="#818cf8" />
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#f8fafc' }}>
              Class Student Roll ({students.length} Enrolled Students)
            </h2>
          </div>
          <button
            style={styles.saveBtn}
            onClick={handleSaveMarks}
            disabled={saving || loading}
          >
            {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
            {saving ? 'Saving & Calculating...' : `Save ${component.toUpperCase()} Marks`}
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>Loading class list for selected assignment...</div>
        ) : students.length === 0 ? (
          <div style={styles.emptyBox}>No students found enrolled in this specific academic context.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Roll No</th>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Course Context</th>
                  <th style={styles.th}>Marks Obtained (Max {getMaxMarkLimit()})</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => {
                  const currentVal = marksState[st._id] !== undefined ? marksState[st._id] : '';
                  const numVal = Number(currentVal);
                  const isInvalid = currentVal !== '' && (isNaN(numVal) || numVal < 0 || numVal > getMaxMarkLimit());

                  return (
                    <tr key={st._id} style={styles.tr}>
                      <td style={styles.tdBold}>{st.rollNumber}</td>
                      <td style={styles.tdCode}>{st.studentId}</td>
                      <td style={styles.tdName}>{st.name}</td>
                      <td style={styles.tdContext}>{assignmentDetails?.course} Sem {assignmentDetails?.semester} Div {assignmentDetails?.division}</td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          min="0"
                          max={getMaxMarkLimit()}
                          step="0.5"
                          style={{
                            ...styles.input,
                            borderColor: isInvalid ? '#ef4444' : 'rgba(255,255,255,0.15)',
                            backgroundColor: isInvalid ? 'rgba(239,68,68,0.1)' : '#0f172a'
                          }}
                          placeholder={`0 - ${getMaxMarkLimit()}`}
                          value={currentVal}
                          onChange={(e) => handleMarkChange(st._id, e.target.value)}
                        />
                      </td>
                      <td style={styles.td}>
                        {isInvalid ? (
                          <span style={styles.badgeError}>Out of range</span>
                        ) : currentVal !== '' ? (
                          <span style={styles.badgeSuccess}><Check size={12} /> Entered</span>
                        ) : (
                          <span style={styles.badgePending}>Pending</span>
                        )}
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
  container: {
    padding: '2rem',
    maxWidth: '1280px',
    margin: '0 auto',
    color: '#f8fafc',
    minHeight: '100vh'
  },
  toast: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    padding: '0.85rem 1.25rem',
    borderRadius: '10px',
    color: '#ffffff',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    zIndex: 9999
  },
  header: {
    marginBottom: '1.5rem'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#818cf8',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    padding: '0.3rem 0.75rem',
    borderRadius: '9999px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    marginBottom: '0.5rem'
  },
  title: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    marginTop: '0.35rem'
  },
  selectorCard: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    padding: '1.25rem 1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '1.25rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  selectorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  select: {
    padding: '0.85rem 1rem',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer'
  },
  contextBanner: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '14px',
    padding: '1.25rem',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
  },
  contextGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem'
  },
  contextItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  contextLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.05em'
  },
  contextVal: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#818cf8',
    marginTop: '0.15rem'
  },
  tabsRow: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    marginBottom: '1.25rem',
    paddingBottom: '0.5rem'
  },
  tabBtn: {
    padding: '0.75rem 1.25rem',
    borderRadius: '10px',
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8',
    fontWeight: 600,
    fontSize: '0.88rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    borderColor: '#818cf8',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid #ef4444',
    padding: '0.85rem 1.25rem',
    borderRadius: '10px',
    color: '#fca5a5',
    fontSize: '0.9rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  tableCard: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
  },
  tableHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '0.7rem 1.25rem',
    borderRadius: '9999px',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  },
  loadingBox: {
    padding: '3rem',
    textAlign: 'center',
    color: '#818cf8',
    fontWeight: 600
  },
  emptyBox: {
    padding: '3rem',
    textAlign: 'center',
    color: '#94a3b8'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '1rem 1.25rem',
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  tdBold: {
    padding: '1rem 1.25rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  tdCode: {
    padding: '1rem 1.25rem',
    fontFamily: 'monospace',
    color: '#818cf8',
    fontSize: '0.85rem'
  },
  tdName: {
    padding: '1rem 1.25rem',
    fontWeight: 600,
    color: '#f1f5f9'
  },
  tdContext: {
    padding: '1rem 1.25rem',
    fontSize: '0.82rem',
    color: '#94a3b8'
  },
  td: {
    padding: '1rem 1.25rem'
  },
  input: {
    width: '120px',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: 700,
    outline: 'none'
  },
  badgeSuccess: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.75rem',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontWeight: 700
  },
  badgePending: {
    fontSize: '0.75rem',
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    color: '#94a3b8',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontWeight: 600
  },
  badgeError: {
    fontSize: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    fontWeight: 700
  }
};

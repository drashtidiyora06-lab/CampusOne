import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  RefreshCw,
  Grid,
  ListFilter
} from 'lucide-react';

export default function TeacherMarksEntryPage() {
  const { user } = useAuth();
  const location = useLocation();

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [viewMode, setViewMode] = useState('full_grid'); // 'full_grid' or 'single_component'
  const [component, setComponent] = useState('ica1');

  // Full Grid State: { [studentId]: { ica1, ica2, ica3, practical, finalExam } }
  const [gridState, setGridState] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [validationError, setValidationError] = useState('');

  // Extract URL search param query `assignmentId`
  const queryParams = new URLSearchParams(location.search);
  const initialAssignmentId = queryParams.get('assignmentId');

  // Fetch teaching assignments for teacher
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/v3/academics/teaching-assignments');
        if (res.data.success && res.data.assignments) {
          setAssignments(res.data.assignments);
          if (initialAssignmentId && res.data.assignments.some(a => a._id === initialAssignmentId)) {
            setSelectedAssignmentId(initialAssignmentId);
          } else if (res.data.assignments.length > 0) {
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
  }, [user, initialAssignmentId]);

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

          // Populate local full grid state for marks
          const initialGrid = {};
          res.data.students.forEach((s) => {
            initialGrid[s._id] = {
              ica1: s.marks?.ica1 !== null && s.marks?.ica1 !== undefined ? s.marks.ica1 : '',
              ica2: s.marks?.ica2 !== null && s.marks?.ica2 !== undefined ? s.marks.ica2 : '',
              ica3: s.marks?.ica3 !== null && s.marks?.ica3 !== undefined ? s.marks.ica3 : '',
              practical: s.marks?.practical !== null && s.marks?.practical !== undefined ? s.marks.practical : '',
              finalExam: s.marks?.finalExam !== null && s.marks?.finalExam !== undefined ? s.marks.finalExam : ''
            };
          });
          setGridState(initialGrid);
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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleGridCellChange = (studentId, field, val) => {
    setValidationError('');
    setGridState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val
      }
    }));
  };

  const subjectType = assignmentDetails?.subject?.type || 'Major';
  const hasPractical = assignmentDetails?.subject?.hasPractical || false;

  // Client-side helper for dynamic calculation preview
  const computePreview = (stId) => {
    const row = gridState[stId] || {};
    const i1 = row.ica1 !== '' && row.ica1 !== null ? Number(row.ica1) : null;
    const i2 = row.ica2 !== '' && row.ica2 !== null ? Number(row.ica2) : null;
    const i3 = row.ica3 !== '' && row.ica3 !== null ? Number(row.ica3) : null;
    const pr = row.practical !== '' && row.practical !== null ? Number(row.practical) : null;
    const fe = row.finalExam !== '' && row.finalExam !== null ? Number(row.finalExam) : null;

    let bestOrMean = 0;
    if (subjectType === 'Major') {
      const valid = [i1, i2, i3].filter((x) => x !== null && !isNaN(x));
      if (valid.length > 0) bestOrMean = Math.max(...valid);
    } else {
      const valid = [i1, i2].filter((x) => x !== null && !isNaN(x));
      if (valid.length > 0) bestOrMean = Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
    }

    let maxTot = 100;
    let obt = bestOrMean + (fe || 0);
    if (hasPractical) {
      maxTot += 50;
      obt += (pr || 0);
    }

    const pct = Math.round((obt / maxTot) * 100 * 10) / 10;
    let grade = 'F';
    if (pct >= 85) grade = 'O';
    else if (pct >= 75) grade = 'A+';
    else if (pct >= 65) grade = 'A';
    else if (pct >= 55) grade = 'B+';
    else if (pct >= 50) grade = 'B';
    else if (pct >= 45) grade = 'C';
    else if (pct >= 40) grade = 'D';

    return { bestOrMean, obt, maxTot, pct, grade };
  };

  const handleSaveFullGrid = async () => {
    setValidationError('');
    const payloadMarks = [];

    // Validation
    for (const s of students) {
      const row = gridState[s._id] || {};
      const validateField = (field, name, max) => {
        const val = row[field];
        if (val !== '' && val !== null && val !== undefined) {
          const num = Number(val);
          if (isNaN(num) || num < 0 || num > max) {
            throw new Error(`Invalid ${name} for ${s.name} (${val}). Must be between 0 and ${max}.`);
          }
          return num;
        }
        return null;
      };

      try {
        const ica1 = validateField('ica1', 'ICA 1', 25);
        const ica2 = validateField('ica2', 'ICA 2', 25);
        const ica3 = validateField('ica3', 'ICA 3', 25);
        const practical = validateField('practical', 'Practical', 50);
        const finalExam = validateField('finalExam', 'Final Exam', 75);

        payloadMarks.push({
          studentId: s._id,
          ica1,
          ica2,
          ica3,
          practical,
          finalExam
        });
      } catch (err) {
        setValidationError(err.message);
        showToast(err.message, 'error');
        return;
      }
    }

    try {
      setSaving(true);
      const res = await api.post('/v3/academics/marks/bulk', {
        assignmentId: selectedAssignmentId,
        fullGrid: true,
        studentMarks: payloadMarks
      });

      if (res.data.success) {
        showToast(res.data.message || 'Marks saved to database successfully!');
        // Refresh local student list from database
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
            <Award size={14} /> CAMPUSONE V3 EXAMINATION ENGINE
          </div>
          <h1 style={styles.title}>Teacher Class Marks & Assessment Console</h1>
          <p style={styles.subtitle}>
            Enter, edit, and persist class assessment marks directly to the database with automatic calculation of Best-of-3 / Mean ICAs.
          </p>
        </div>
      </div>

      {/* Assignment Selection Bar */}
      <div style={styles.selectorCard}>
        <div style={styles.selectorGroup}>
          <label style={styles.label}>
            <BookOpen size={16} color="#818cf8" /> Select Teaching Assignment (Academic Context):
          </label>
          <select
            style={styles.select}
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
          >
            {assignments.map((ta) => (
              <option key={ta._id} value={ta._id}>
                {ta.course} / Sem {ta.semester} / Div {ta.division} — {ta.subjectCode}: {ta.subjectName || ta.subject?.name} ({ta.subjectType || 'Major'})
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

      {/* View Mode Toggle Bar */}
      <div style={styles.viewToggleRow}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            style={{ ...styles.viewBtn, ...(viewMode === 'full_grid' ? styles.viewBtnActive : {}) }}
            onClick={() => setViewMode('full_grid')}
          >
            <Grid size={15} /> Full Marksheet View (All Components)
          </button>
          <button
            style={{ ...styles.viewBtn, ...(viewMode === 'single_component' ? styles.viewBtnActive : {}) }}
            onClick={() => setViewMode('single_component')}
          >
            <ListFilter size={15} /> Single Component View
          </button>
        </div>
      </div>

      {/* Validation Warning */}
      {validationError && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* FULL MARKSHEET GRID VIEW */}
      {viewMode === 'full_grid' ? (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#818cf8" />
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#f8fafc' }}>
                Enrolled Students Marksheet ({students.length} Students)
              </h2>
            </div>
            <button
              style={styles.saveBtn}
              onClick={handleSaveFullGrid}
              disabled={saving || loading}
            >
              {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
              {saving ? 'Saving to Database...' : 'Save All Marks to Database'}
            </button>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Fetching student class list and database records...</div>
          ) : students.length === 0 ? (
            <div style={styles.emptyBox}>No students enrolled in this specific academic context.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Roll No</th>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>ICA 1 (25)</th>
                    <th style={styles.th}>ICA 2 (25)</th>
                    <th style={styles.th}>ICA 3 (25)</th>
                    <th style={styles.thHighlightHeader}>
                      {subjectType === 'Major' ? 'Best ICA' : 'ICA Mean'}
                    </th>
                    <th style={styles.th}>Practical (50)</th>
                    <th style={styles.th}>Semester Exam (75)</th>
                    <th style={styles.th}>Total (Obtd/Max)</th>
                    <th style={styles.th}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => {
                    const row = gridState[st._id] || {};
                    const calc = computePreview(st._id);

                    return (
                      <tr key={st._id} style={styles.tr}>
                        <td style={styles.tdBold}>{st.rollNumber}</td>
                        <td style={styles.tdName}>{st.name}</td>

                        {/* ICA 1 */}
                        <td style={styles.td}>
                          <input
                            type="number"
                            min="0"
                            max="25"
                            step="0.5"
                            style={styles.cellInput}
                            placeholder="0-25"
                            value={row.ica1}
                            onChange={(e) => handleGridCellChange(st._id, 'ica1', e.target.value)}
                          />
                        </td>

                        {/* ICA 2 */}
                        <td style={styles.td}>
                          <input
                            type="number"
                            min="0"
                            max="25"
                            step="0.5"
                            style={styles.cellInput}
                            placeholder="0-25"
                            value={row.ica2}
                            onChange={(e) => handleGridCellChange(st._id, 'ica2', e.target.value)}
                          />
                        </td>

                        {/* ICA 3 */}
                        <td style={styles.td}>
                          {subjectType === 'Major' ? (
                            <input
                              type="number"
                              min="0"
                              max="25"
                              step="0.5"
                              style={styles.cellInput}
                              placeholder="0-25"
                              value={row.ica3}
                              onChange={(e) => handleGridCellChange(st._id, 'ica3', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>N/A</span>
                          )}
                        </td>

                        {/* Computed Best ICA or Mean */}
                        <td style={styles.tdHighlight}>{calc.bestOrMean}</td>

                        {/* Practical */}
                        <td style={styles.td}>
                          {hasPractical ? (
                            <input
                              type="number"
                              min="0"
                              max="50"
                              step="0.5"
                              style={styles.cellInput}
                              placeholder="0-50"
                              value={row.practical}
                              onChange={(e) => handleGridCellChange(st._id, 'practical', e.target.value)}
                            />
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>N/A</span>
                          )}
                        </td>

                        {/* Semester Exam */}
                        <td style={styles.td}>
                          <input
                            type="number"
                            min="0"
                            max="75"
                            step="0.5"
                            style={styles.cellInput}
                            placeholder="0-75"
                            value={row.finalExam}
                            onChange={(e) => handleGridCellChange(st._id, 'finalExam', e.target.value)}
                          />
                        </td>

                        {/* Total Marks */}
                        <td style={styles.tdBold}>
                          {calc.obt} / {calc.maxTot}
                        </td>

                        {/* Calculated Grade */}
                        <td style={styles.td}>
                          <span style={styles.gradeBadge}>{calc.grade}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* SINGLE COMPONENT TAB VIEW */
        <div style={styles.tableCard}>
          <div style={styles.componentTabHeader}>
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
              {subjectType === 'Major' && (
                <button
                  style={{ ...styles.tabBtn, ...(component === 'ica3' ? styles.tabBtnActive : {}) }}
                  onClick={() => setComponent('ica3')}
                >
                  ICA 3 (25 Marks)
                </button>
              )}
              {hasPractical && (
                <button
                  style={{ ...styles.tabBtn, ...(component === 'practical' ? styles.tabBtnActive : {}) }}
                  onClick={() => setComponent('practical')}
                >
                  Practical (50 Marks)
                </button>
              )}
              <button
                style={{ ...styles.tabBtn, ...(component === 'finalExam' ? styles.tabBtnActive : {}) }}
                onClick={() => setComponent('finalExam')}
              >
                Final Exam (75 Marks)
              </button>
            </div>
            <button style={styles.saveBtn} onClick={handleSaveFullGrid} disabled={saving}>
              {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Roll No</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Score Input</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => {
                  const row = gridState[st._id] || {};
                  const val = row[component] !== undefined ? row[component] : '';
                  return (
                    <tr key={st._id} style={styles.tr}>
                      <td style={styles.tdBold}>{st.rollNumber}</td>
                      <td style={styles.tdName}>{st.name}</td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          step="0.5"
                          style={styles.cellInput}
                          value={val}
                          onChange={(e) => handleGridCellChange(st._id, component, e.target.value)}
                        />
                      </td>
                      <td style={styles.td}>
                        {val !== '' ? (
                          <span style={styles.badgeSuccess}><Check size={12} /> Saved</span>
                        ) : (
                          <span style={styles.badgePending}>Empty</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  viewToggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  viewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1.1rem',
    borderRadius: '8px',
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  viewBtnActive: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    borderColor: '#818cf8',
    fontWeight: 700
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
  componentTabHeader: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  tabsRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  tabBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    borderColor: '#818cf8'
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
    padding: '1rem 1rem',
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    fontSize: '0.78rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  thHighlightHeader: {
    padding: '1rem 1rem',
    backgroundColor: '#0f172a',
    color: '#34d399',
    fontSize: '0.78rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  tdBold: {
    padding: '0.85rem 1rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  tdName: {
    padding: '0.85rem 1rem',
    fontWeight: 600,
    color: '#f1f5f9'
  },
  td: {
    padding: '0.85rem 1rem'
  },
  tdHighlight: {
    padding: '0.85rem 1rem',
    fontWeight: 800,
    color: '#34d399',
    fontSize: '0.95rem'
  },
  cellInput: {
    width: '90px',
    padding: '0.45rem 0.6rem',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: 700,
    outline: 'none'
  },
  gradeBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    fontWeight: 800,
    fontSize: '0.85rem'
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
  }
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen,
  FileText,
  Upload,
  CheckSquare,
  Award,
  Download,
  Plus,
  Clock,
  UserCheck,
  CheckCircle,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const TeacherDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assignments_v3');
  const [stats, setStats] = useState({ totalAssignments: 0, totalResources: 0, totalCourses: 0, totalSubmissions: 0 });
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachingAssignments, setTeachingAssignments] = useState([]);

  // Modals
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [showUploadResourceModal, setShowUploadResourceModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  // Form states
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: 'Database Management Systems', dueDate: '', maxMarks: 100, description: '' });
  const [gradeData, setGradeData] = useState({ grade: 'A+', feedback: 'Excellent submission!' });

  useEffect(() => {
    fetchTeacherData();
  }, [user]);

  const fetchTeacherData = async () => {
    // 1. Fetch V3 Teaching Assignments (Primary)
    try {
      const taRes = await api.get('/v3/academics/teaching-assignments');
      if (taRes.data.success) {
        setTeachingAssignments(taRes.data.assignments || []);
      }
    } catch (err) {
      console.warn('V3 teaching assignments fetch warning:', err);
    }

    // 2. Fetch V2 dashboard stats
    try {
      const dashRes = await api.get('/teacher/dashboard');
      if (dashRes.data.success) {
        setStats(dashRes.data.stats || { totalAssignments: 0, totalResources: 0, totalCourses: 0, totalSubmissions: 0 });
        setAssignments(dashRes.data.assignments || []);
        setCourses(dashRes.data.courses || []);
      }
    } catch (err) {
      console.warn('Teacher dashboard fetch warning:', err);
    }

    // 3. Fetch V2 submissions
    try {
      const subRes = await api.get('/teacher/submissions');
      if (subRes.data.success) {
        setSubmissions(subRes.data.submissions || []);
      }
    } catch (err) {
      console.warn('Teacher submissions fetch warning:', err);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/academics/assignments', newAssignment);
      if (res.data.success) {
        setShowCreateAssignmentModal(false);
        setNewAssignment({ title: '', subject: 'Database Management Systems', dueDate: '', maxMarks: 100, description: '' });
        fetchTeacherData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating assignment');
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    try {
      const res = await api.put('/teacher/grade', {
        assignmentId: selectedSub.assignmentId,
        submissionId: selectedSub.submissionId,
        grade: gradeData.grade,
        feedback: gradeData.feedback
      });
      if (res.data.success) {
        setSelectedSub(null);
        fetchTeacherData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Grading failed');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Portal & Academic Workspace</h1>
          <p className="page-subtitle">
            Welcome, <strong>{user?.name || 'Dr. Vikram Seth'}</strong> ({user?.facultyId || 'FAC-CS-022'}) • {user?.department || user?.branch || 'Computer Science & Commerce'} Department
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={() => navigate('/teacher/marks')}>
            <Award size={16} /> Marks Entry Console
          </button>
          <button className="btn-secondary" onClick={() => setShowCreateAssignmentModal(true)}>
            <Plus size={16} /> Post Course Assignment
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statIconBox}>
            <Layers size={22} color="#818cf8" />
          </div>
          <div>
            <div style={styles.statVal}>{teachingAssignments.length}</div>
            <div style={styles.statLabel}>My Teaching Assignments</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(52, 211, 153, 0.15)' }}>
            <UserCheck size={22} color="#34d399" />
          </div>
          <div>
            <div style={styles.statVal}>{stats.totalSubmissions}</div>
            <div style={styles.statLabel}>Student Submissions</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(251, 191, 36, 0.15)' }}>
            <BookOpen size={22} color="#fbbf24" />
          </div>
          <div>
            <div style={styles.statVal}>{stats.totalCourses || 4}</div>
            <div style={styles.statLabel}>Assigned Subjects</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'assignments_v3' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('assignments_v3')}
        >
          <Layers size={16} /> My Teaching Assignments ({teachingAssignments.length})
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'submissions' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('submissions')}
        >
          <CheckSquare size={16} /> Student Submissions ({submissions.length})
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'assignments' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('assignments')}
        >
          <FileText size={16} /> Course Assignments
        </button>
      </div>

      {/* TAB 0: V3 TEACHING ASSIGNMENTS (MY TEACHING ASSIGNMENTS) */}
      {activeTab === 'assignments_v3' && (
        <div style={styles.v3Section}>
          <div style={styles.sectionHeader}>
            <ShieldCheck size={20} color="#818cf8" />
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>
              MY TEACHING ASSIGNMENTS
            </h2>
          </div>

          {teachingAssignments.length === 0 ? (
            <div style={styles.emptyBox}>No active teaching assignments allocated yet.</div>
          ) : (
            <div style={styles.taGrid}>
              {teachingAssignments.map((ta) => (
                <div key={ta._id} style={styles.taCard}>
                  <div style={styles.taBadgeRow}>
                    <span style={styles.courseBadge}>{ta.course}</span>
                    <span style={styles.divBadge}>Semester {ta.semester} • Division {ta.division}</span>
                  </div>

                  <h3 style={styles.taSubjectName}>
                    {ta.subjectCode}: {ta.subjectName || ta.subject?.name}
                  </h3>

                  <div style={styles.taMetaGrid}>
                    <div style={styles.taMetaItem}>
                      <span style={styles.taMetaLabel}>Evaluation Rule:</span>
                      <span style={{ color: '#a7f3d0', fontWeight: 700 }}>
                        {ta.subjectType === 'Major' ? 'Major (Best of 3 ICAs)' : 'Minor (ICA Mean)'}
                      </span>
                    </div>

                    <div style={styles.taMetaItem}>
                      <span style={styles.taMetaLabel}>Practical:</span>
                      <span style={{ color: ta.hasPractical ? '#fef08a' : '#94a3b8', fontWeight: 700 }}>
                        {ta.hasPractical ? 'Practical Included (50M)' : 'No Practical'}
                      </span>
                    </div>

                    <div style={styles.taMetaItem}>
                      <span style={styles.taMetaLabel}>Academic Year:</span>
                      <span style={{ color: '#cbd5e1' }}>{ta.academicYear}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      style={styles.manageMarksBtn}
                      onClick={() => navigate(`/teacher/marks?assignmentId=${ta._id}`)}
                    >
                      <Award size={14} /> Marks
                    </button>
                    <button
                      style={{ ...styles.manageMarksBtn, backgroundColor: '#3b82f6' }}
                      onClick={() => navigate(`/teacher/attendance?assignmentId=${ta._id}`)}
                    >
                      <Clock size={14} /> Attendance
                    </button>
                    <button
                      style={{ ...styles.manageMarksBtn, backgroundColor: '#8b5cf6' }}
                      onClick={() => setActiveTab('assignments')}
                    >
                      <FileText size={14} /> Assignments
                    </button>
                    <button
                      style={{ ...styles.manageMarksBtn, backgroundColor: '#10b981' }}
                      onClick={() => navigate('/resources')}
                    >
                      <BookOpen size={14} /> Resources
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: SUBMISSIONS REVIEW */}
      {activeTab === 'submissions' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem' }}>
            Student Assignment Submissions
          </h3>

          {submissions.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1.5rem' }}>No student submissions yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Assignment</th>
                  <th>Submitted Date</th>
                  <th>File Link</th>
                  <th>Status</th>
                  <th>Action / Grade</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{sub.studentName}</td>
                    <td>{sub.assignmentTitle}</td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => window.open(sub.fileUrl, '_blank')}
                      >
                        <Download size={13} /> {sub.fileName || 'Download PDF'}
                      </button>
                    </td>
                    <td>
                      <span className={`badge ${sub.status === 'Graded' ? 'badge-green' : 'badge-amber'}`}>
                        {sub.status || 'Submitted'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-primary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => {
                          setSelectedSub(sub);
                          setGradeData({ grade: sub.grade || 'A+', feedback: sub.feedback || 'Good work' });
                        }}
                      >
                        <Award size={13} /> {sub.grade ? `Grade: ${sub.grade}` : 'Grade Work'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS LIST */}
      {activeTab === 'assignments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {assignments.map((asg) => (
            <div key={asg._id} className="card">
              <span className="badge badge-indigo">{asg.subject}</span>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>
                {asg.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.4 }}>
                {asg.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                <span>Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                <span>Max Marks: {asg.maxMarks}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Assignment Modal */}
      {showCreateAssignmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>Create Course Assignment</h2>
            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label className="form-label">Assignment Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. B+ Tree Implementation Report"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Instructions</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateAssignmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {selectedSub && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Grade Submission: {selectedSub.studentName}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {selectedSub.assignmentTitle} ({selectedSub.subject})
            </p>

            <form onSubmit={handleGradeSubmission}>
              <div className="form-group">
                <label className="form-label">Grade / Marks</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. A+ or 95/100"
                  value={gradeData.grade}
                  onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instructor Remarks & Feedback</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedSub(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save & Notify Student
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
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.75rem'
  },
  statCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statVal: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  statLabel: {
    fontSize: '0.78rem',
    color: '#94a3b8'
  },
  tabBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    padding: '0.55rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    color: '#cbd5e1'
  },
  v3Section: {
    marginBottom: '2rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  emptyBox: {
    padding: '2.5rem',
    textAlign: 'center',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    color: '#94a3b8'
  },
  taGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  taCard: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    padding: '1.5rem',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  taBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.65rem'
  },
  courseBadge: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px'
  },
  divBadge: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#fef08a',
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px'
  },
  taSubjectName: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0.25rem 0 1rem 0',
    lineHeight: 1.3
  },
  taMetaGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    marginBottom: '1.25rem',
    fontSize: '0.82rem',
    backgroundColor: '#0f172a',
    padding: '0.85rem',
    borderRadius: '8px'
  },
  taMetaItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  taMetaLabel: {
    color: '#64748b',
    fontWeight: '600'
  },
  manageMarksBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  }
};

export default TeacherDashboardPage;

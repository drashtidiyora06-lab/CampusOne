import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Shield,
  BookOpen,
  Users,
  Award,
  Layers,
  CheckCircle,
  TrendingUp,
  FileCheck2,
  FolderDown,
  Database
} from 'lucide-react';

export default function AdminAcademicManagementPage() {
  const [tab, setTab] = useState('assignments');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cRes, sRes, aRes, stRes] = await Promise.all([
          api.get('/v3/academics/courses'),
          api.get('/v3/academics/subjects'),
          api.get('/v3/academics/teaching-assignments?all=true'),
          api.get('/v3/academics/admin/stats')
        ]);

        if (cRes.data.success) setCourses(cRes.data.courses);
        if (sRes.data.success) setSubjects(sRes.data.subjects);
        if (aRes.data.success) setAssignments(aRes.data.assignments);
        if (stRes.data.success) setStats(stRes.data.stats);
      } catch (err) {
        console.error('Error fetching admin academic data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            <Shield size={14} /> CAMPUSONE V3 INSTITUTIONAL ADMINISTRATION
          </div>
          <h1 style={styles.title}>Academic Structure & Teaching Assignments</h1>
          <p style={styles.subtitle}>
            Institutional governance for Courses, Semesters, Divisions, Subjects, and Teaching Assignments.
          </p>
        </div>
      </div>

      {/* Real Statistics Grid */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.sLabel}>OFFICIAL COURSES</span>
            <span style={styles.sVal}>{stats.totalCourses} Programs</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.sLabel}>OFFICIAL SUBJECTS</span>
            <span style={styles.sVal}>{stats.totalSubjects} Subjects</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.sLabel}>TEACHING ASSIGNMENTS</span>
            <span style={styles.sVal}>{stats.totalTeachingAssignments} Active</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.sLabel}>ENROLLED STUDENTS</span>
            <span style={styles.sVal}>{stats.totalStudents} Students</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.sLabel}>FACULTY MEMBERS</span>
            <span style={styles.sVal}>{stats.totalTeachers} Teachers</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.sLabel}>CALCULATED RESULTS</span>
            <span style={styles.sVal}>{stats.totalResults} Marksheets</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={styles.tabsRow}>
        <button
          style={{ ...styles.tabBtn, ...(tab === 'assignments' ? styles.tabBtnActive : {}) }}
          onClick={() => setTab('assignments')}
        >
          Teaching Assignments Matrix ({assignments.length})
        </button>
        <button
          style={{ ...styles.tabBtn, ...(tab === 'courses' ? styles.tabBtnActive : {}) }}
          onClick={() => setTab('courses')}
        >
          Institutional Courses ({courses.length})
        </button>
        <button
          style={{ ...styles.tabBtn, ...(tab === 'subjects' ? styles.tabBtnActive : {}) }}
          onClick={() => setTab('subjects')}
        >
          Subject Catalog ({subjects.length})
        </button>
      </div>

      {/* Content Panels */}
      {loading ? (
        <div style={styles.loadingBox}>Loading academic management console...</div>
      ) : tab === 'assignments' ? (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <Layers size={18} color="#818cf8" />
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#f8fafc' }}>
              Active Teaching Assignments & Academic Isolation Contexts
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Assignment ID</th>
                  <th style={styles.th}>Faculty Teacher</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Sem</th>
                  <th style={styles.th}>Div</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Practical</th>
                  <th style={styles.th}>Academic Year</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((ta) => (
                  <tr key={ta._id} style={styles.tr}>
                    <td style={styles.tdCode}>{ta.teachingAssignmentId}</td>
                    <td style={styles.tdName}>{ta.teacherName || ta.teacher?.name} ({ta.teacherIdCode})</td>
                    <td style={styles.tdCourse}>{ta.course}</td>
                    <td style={styles.td}>{ta.semester}</td>
                    <td style={styles.tdDiv}>Div {ta.division}</td>
                    <td style={styles.tdBold}>{ta.subjectCode}: {ta.subjectName || ta.subject?.name}</td>
                    <td style={styles.td}>{ta.subjectType || 'Major'}</td>
                    <td style={styles.td}>{ta.hasPractical ? 'Yes (50M)' : 'No'}</td>
                    <td style={styles.td}>{ta.academicYear}</td>
                    <td style={styles.td}>
                      <span style={styles.badgeActive}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'courses' ? (
        <div style={styles.coursesGrid}>
          {courses.map((c) => (
            <div key={c._id} style={styles.courseCard}>
              <div style={styles.courseHeader}>
                <span style={styles.courseCode}>{c.code}</span>
                <span style={styles.semTag}>{c.totalSemesters} Semesters</span>
              </div>
              <h3 style={styles.courseTitle}>{c.name}</h3>
              <p style={styles.courseDesc}>{c.description}</p>
              <div style={styles.divRow}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Divisions:</span>
                {c.divisions?.map((d) => (
                  <span key={d} style={styles.divChip}>Division {d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <BookOpen size={18} color="#818cf8" />
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#f8fafc' }}>
              Master Subject Catalog
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subject Code</th>
                  <th style={styles.th}>Subject Name</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Semester</th>
                  <th style={styles.th}>Evaluation Type</th>
                  <th style={styles.th}>Practical Component</th>
                  <th style={styles.th}>Credits</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s._id} style={styles.tr}>
                    <td style={styles.tdCode}>{s.code}</td>
                    <td style={styles.tdName}>{s.name}</td>
                    <td style={styles.tdCourse}>{s.course}</td>
                    <td style={styles.td}>Sem {s.semester}</td>
                    <td style={styles.td}>{s.type} ({s.type === 'Major' ? 'Best of 3 ICAs' : 'ICA Mean'})</td>
                    <td style={styles.td}>{s.hasPractical ? 'Practical Included' : 'No Practical'}</td>
                    <td style={styles.tdBold}>{s.credits} Credits</td>
                  </tr>
                ))}
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column'
  },
  sLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#64748b'
  },
  sVal: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#818cf8',
    marginTop: '0.2rem'
  },
  tabsRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  tabBtn: {
    padding: '0.75rem 1.25rem',
    borderRadius: '10px',
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8',
    fontWeight: 600,
    fontSize: '0.88rem',
    cursor: 'pointer'
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    borderColor: '#818cf8',
    fontWeight: 700
  },
  loadingBox: {
    padding: '3rem',
    textAlign: 'center',
    color: '#818cf8',
    fontWeight: 600
  },
  tableCard: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'hidden'
  },
  tableHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
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
  tdCode: {
    padding: '1rem 1.25rem',
    fontFamily: 'monospace',
    color: '#818cf8',
    fontSize: '0.85rem',
    fontWeight: 700
  },
  tdName: {
    padding: '1rem 1.25rem',
    fontWeight: 600,
    color: '#f1f5f9'
  },
  tdCourse: {
    padding: '1rem 1.25rem',
    fontWeight: 700,
    color: '#a7f3d0'
  },
  tdDiv: {
    padding: '1rem 1.25rem',
    fontWeight: 700,
    color: '#fef08a'
  },
  tdBold: {
    padding: '1rem 1.25rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  td: {
    padding: '1rem 1.25rem',
    color: '#cbd5e1',
    fontSize: '0.88rem'
  },
  badgeActive: {
    fontSize: '0.75rem',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontWeight: 700
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem'
  },
  courseCard: {
    backgroundColor: '#1e293b',
    padding: '1.5rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  courseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  courseCode: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#818cf8'
  },
  semTag: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    backgroundColor: '#0f172a',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px'
  },
  courseTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0.25rem 0'
  },
  courseDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: '0.5rem 0 1rem 0'
  },
  divRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  divChip: {
    fontSize: '0.75rem',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontWeight: 700
  }
};

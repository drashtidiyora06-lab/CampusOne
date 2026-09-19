import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  BarChart2,
  TrendingUp,
  FileText,
  Sparkles,
  Layers
} from 'lucide-react';

export default function StudentResultsPage() {
  const { user } = useAuth();
  const [semester, setSemester] = useState(3);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/v3/academics/results?semester=${semester}`);
        if (res.data.success) {
          setResultData(res.data.result);
        }
      } catch (err) {
        console.error('Error fetching semester result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [semester]);

  const getGradeBadge = (grade) => {
    const colors = {
      O: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399', border: '#10b981' },
      'A+': { bg: 'rgba(99, 102, 241, 0.2)', text: '#818cf8', border: '#6366f1' },
      A: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', border: '#3b82f6' },
      'B+': { bg: 'rgba(234, 179, 8, 0.2)', text: '#fde047', border: '#eab308' },
      B: { bg: 'rgba(249, 115, 22, 0.2)', text: '#fdba74', border: '#f97316' },
      C: { bg: 'rgba(148, 163, 184, 0.2)', text: '#cbd5e1', border: '#94a3b8' },
      D: { bg: 'rgba(148, 163, 184, 0.2)', text: '#cbd5e1', border: '#94a3b8' },
      F: { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5', border: '#ef4444' }
    };
    const c = colors[grade] || colors.C;
    return (
      <span
        style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontWeight: 800,
          fontSize: '0.85rem',
          backgroundColor: c.bg,
          color: c.text,
          border: `1px solid ${c.border}`
        }}
      >
        {grade}
      </span>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>
            <Award size={14} /> CAMPUSONE V3 EXAMINATION RESULTS
          </div>
          <h1 style={styles.title}>Academic Performance & Semester Results</h1>
          <p style={styles.subtitle}>
            Verified semester marksheets with automated ICA Best-of-Three / Mean calculation and grading breakdown.
          </p>
        </div>
      </div>

      {/* Student Academic Identity Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileGrid}>
          <div style={styles.profileItem}>
            <span style={styles.pLabel}>STUDENT NAME</span>
            <span style={styles.pVal}>{user?.name}</span>
          </div>
          <div style={styles.profileItem}>
            <span style={styles.pLabel}>STUDENT ID</span>
            <span style={styles.pValCode}>{user?.studentId || 'STU-BCOM-101'}</span>
          </div>
          <div style={styles.profileItem}>
            <span style={styles.pLabel}>COURSE</span>
            <span style={styles.pVal}>{user?.course || 'BCOM'}</span>
          </div>
          <div style={styles.profileItem}>
            <span style={styles.pLabel}>CURRENT DIVISION</span>
            <span style={styles.pVal}>Division {user?.division || 'A'}</span>
          </div>
        </div>
      </div>

      {/* Semester Picker */}
      <div style={styles.pickerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#818cf8" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Select Semester:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <button
              key={s}
              style={{ ...styles.semBtn, ...(semester === s ? styles.semBtnActive : {}) }}
              onClick={() => setSemester(s)}
            >
              Semester {s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={styles.loadingBox}>Fetching official semester examination record...</div>
      ) : !resultData ? (
        <div style={styles.emptyBox}>
          <FileText size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3>No Examination Record Available</h3>
          <p>Results for Semester {semester} have not been declared or published yet.</p>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <span>OVERALL SGPA</span>
                <TrendingUp size={20} color="#10b981" />
              </div>
              <div style={styles.metricValue}>{resultData.sgpa} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/ 10</span></div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <span>TOTAL PERCENTAGE</span>
                <BarChart2 size={20} color="#818cf8" />
              </div>
              <div style={styles.metricValue}>{resultData.overallPercentage}%</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <span>OVERALL GRADE</span>
                <Award size={20} color="#f59e0b" />
              </div>
              <div style={{ marginTop: '0.5rem' }}>{getGradeBadge(resultData.overallGrade)}</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <span>FINAL RESULT STATUS</span>
                {resultData.overallStatus === 'Pass' ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
              </div>
              <div style={{ ...styles.metricValue, color: resultData.overallStatus === 'Pass' ? '#34d399' : '#fca5a5' }}>
                {resultData.overallStatus}
              </div>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <BookOpen size={18} color="#818cf8" />
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#f8fafc' }}>
                Subject-wise Examination Marksheet
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Code</th>
                    <th style={styles.th}>Subject Title</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>ICA 1 (25)</th>
                    <th style={styles.th}>ICA 2 (25)</th>
                    <th style={styles.th}>ICA 3 (25)</th>
                    <th style={styles.th}>ICA Component (Best 2 / Mean)</th>
                    <th style={styles.th}>Practical (50)</th>
                    <th style={styles.th}>Final Exam (75)</th>
                    <th style={styles.th}>Total (Obtained/Max)</th>
                    <th style={styles.th}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.subjectResults?.map((item) => (
                    <tr key={item.subjectCode} style={styles.tr}>
                      <td style={styles.tdCode}>{item.subjectCode}</td>
                      <td style={styles.tdName}>{item.subjectName}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.typeBadge,
                          backgroundColor: item.subjectType === 'Major' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                          color: item.subjectType === 'Major' ? '#818cf8' : '#fde047'
                        }}>
                          {item.subjectType}
                        </span>
                      </td>
                      <td style={styles.td}>{item.ica1 !== null ? item.ica1 : '-'}</td>
                      <td style={styles.td}>{item.ica2 !== null ? item.ica2 : '-'}</td>
                      <td style={styles.td}>{item.subjectType === 'Major' ? (item.ica3 !== null ? item.ica3 : '-') : 'N/A'}</td>
                      <td style={styles.tdHighlight}>{item.bestIcaOrMean} / {item.subjectType === 'Major' ? 50 : 25}</td>
                      <td style={styles.td}>{item.hasPractical ? (item.practical !== null ? item.practical : '-') : 'N/A'}</td>
                      <td style={styles.td}>{item.finalExam !== null ? item.finalExam : '-'}</td>
                      <td style={styles.tdBold}>
                        {item.totalMarksObtained} / {item.totalMaxMarks} ({item.percentage}%)
                      </td>
                      <td style={styles.td}>{getGradeBadge(item.grade)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
  profileCard: {
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    padding: '1.25rem 1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '1.25rem'
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem'
  },
  profileItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  pLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#64748b'
  },
  pVal: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff',
    marginTop: '0.15rem'
  },
  pValCode: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#818cf8',
    fontFamily: 'monospace',
    marginTop: '0.15rem'
  },
  pickerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    padding: '1rem 1.25rem',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  semBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  semBtnActive: {
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
  emptyBox: {
    padding: '4rem',
    textAlign: 'center',
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.5rem'
  },
  metricCard: {
    backgroundColor: '#1e293b',
    padding: '1.25rem',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.05em'
  },
  metricValue: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#ffffff',
    marginTop: '0.5rem'
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
  td: {
    padding: '1rem 1.25rem',
    color: '#cbd5e1',
    fontSize: '0.9rem'
  },
  tdHighlight: {
    padding: '1rem 1.25rem',
    fontWeight: 700,
    color: '#34d399',
    fontSize: '0.95rem'
  },
  tdBold: {
    padding: '1rem 1.25rem',
    fontWeight: 700,
    color: '#ffffff'
  },
  typeBadge: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontWeight: 700
  }
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Calendar,
  BookOpen,
  FileText,
  Award,
  Upload,
  CheckCircle,
  Clock,
  User,
  MapPin,
  ChevronRight
} from 'lucide-react';

const AcademicsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('timetable');

  const [timetable, setTimetable] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState(null);

  // Submit Modal state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const [ttRes, sylRes, asgRes, exmRes, resRes] = await Promise.all([
        api.get('/academics/timetable'),
        api.get('/academics/syllabus'),
        api.get('/academics/assignments'),
        api.get('/academics/exams'),
        api.get('/academics/results')
      ]);

      if (ttRes.data.success) setTimetable(ttRes.data.timetable);
      if (sylRes.data.success) setSyllabus(sylRes.data.syllabus);
      if (asgRes.data.success) setAssignments(asgRes.data.assignments);
      if (exmRes.data.success) setExams(exmRes.data.exams[0] || null);
      if (resRes.data.success) setResults(resRes.data.results[0] || null);
    } catch (err) {
      console.warn('Academic data fetch error');
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      const res = await api.post(`/academics/assignments/${selectedAssignment._id}/submit`, {
        fileUrl: submissionFile || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'my_assignment_submission.pdf'
      });
      if (res.data.success) {
        setSubmitSuccess('Assignment submitted successfully!');
        setTimeout(() => {
          setSelectedAssignment(null);
          setSubmitSuccess('');
          fetchAcademicData();
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Academics Portal</h1>
          <p className="page-subtitle">
            Timetable, syllabus modules, course assignments, and examination gradecards
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={styles.tabContainer}>
        {[
          { key: 'timetable', label: 'Class Timetable', icon: Calendar },
          { key: 'syllabus', label: 'Syllabus & Courses', icon: BookOpen },
          { key: 'assignments', label: 'Assignments', icon: FileText },
          { key: 'exams', label: 'Exams & Results', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              style={{
                ...styles.tabBtn,
                ...(activeTab === tab.key ? styles.tabBtnActive : {})
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={17} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div style={styles.timetableStack}>
          {timetable?.schedule?.map((dayObj) => (
            <div key={dayObj.day} className="card" style={{ padding: '1.25rem' }}>
              <h3 style={styles.dayHeading}>
                <Calendar size={18} color="#818cf8" /> {dayObj.day}
              </h3>
              <div style={styles.slotGrid}>
                {dayObj.slots.map((slot, idx) => (
                  <div key={idx} style={styles.slotCard}>
                    <div style={styles.slotTime}>
                      <Clock size={13} color="#60a5fa" /> {slot.time}
                    </div>
                    <h4 style={styles.slotSubject}>{slot.subject}</h4>
                    <div style={styles.slotMeta}>
                      <span>{slot.code}</span>
                      <span>•</span>
                      <span><User size={12} /> {slot.instructor}</span>
                    </div>
                    <div style={styles.roomPill}>
                      <MapPin size={11} /> {slot.room}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SYLLABUS */}
      {activeTab === 'syllabus' && (
        <div style={styles.syllabusGrid}>
          {syllabus.map((subject) => (
            <div key={subject._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-indigo">{subject.code}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{subject.credits} Credits</span>
              </div>
              <h3 style={styles.syllabusTitle}>{subject.subject}</h3>

              <div style={styles.moduleList}>
                {subject.modules.map((mod, i) => (
                  <div key={i} style={styles.moduleBox}>
                    <h4 style={styles.modTitle}>{mod.title}</h4>
                    <ul style={styles.topicList}>
                      {mod.topics.map((t, ti) => (
                        <li key={ti}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div style={styles.assignmentGrid}>
          {assignments.map((asg) => {
            const hasSubmitted = asg.submissions?.some(
              (s) => s.studentId?.toString() === user?._id?.toString()
            );

            return (
              <div key={asg._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-blue">{asg.subject}</span>
                  <span className={`badge ${hasSubmitted ? 'badge-green' : 'badge-amber'}`}>
                    {hasSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>

                <h3 style={styles.asgTitle}>{asg.title}</h3>
                <p style={styles.asgDesc}>{asg.description}</p>

                <div style={styles.asgFooter}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} /> Due: {new Date(asg.dueDate).toLocaleDateString()}
                  </div>


                  <button
                    className="btn-primary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                    onClick={() => setSelectedAssignment(asg)}
                  >
                    <Upload size={14} /> {hasSubmitted ? 'Resubmit File' : 'Submit Work'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: EXAMS & RESULTS */}
      {activeTab === 'exams' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Exam Schedule */}
          <div className="card">
            <h3 style={{ ...styles.dayHeading, marginBottom: '1rem' }}>
              <Calendar size={18} color="#fbbf24" /> {exams?.title || 'Exam Schedule'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {exams?.exams?.map((e, idx) => (
                <div key={idx} style={styles.examRow}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem' }}>
                      {e.subject} ({e.code})
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {new Date(e.date).toDateString()} • {e.time}
                    </div>
                  </div>
                  <span className="badge badge-amber">{e.hall}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Card */}
          <div className="card">
            <h3 style={{ ...styles.dayHeading, marginBottom: '1rem' }}>
              <Award size={18} color="#34d399" /> Student Gradecard ({results?.semester || 'Semester 5'})
            </h3>

            <div style={styles.gpaBanner}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CUMULATIVE CGPA</span>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#34d399' }}>
                  {results?.cgpa || '8.85'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SEMESTER SGPA</span>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#60a5fa' }}>
                  {results?.sgpa || '9.10'}
                </div>
              </div>
            </div>

            <table style={styles.resultTable}>
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {results?.subjects?.map((sub, idx) => (
                  <tr key={idx}>
                    <td>{sub.code}</td>
                    <td>{sub.name}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>{sub.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Submit Modal */}
      {selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Submit: {selectedAssignment.title}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Upload your completed report, PDF file link, or GitHub code link.
            </p>

            {submitSuccess && (
              <div style={{ color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.15)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> {submitSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitAssignment}>
              <div className="form-group">
                <label className="form-label">Upload PDF / Document File</label>
                <input
                  type="file"
                  className="form-input"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const upRes = await api.post('/api/upload', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        if (upRes.data.success) {
                          setSubmissionFile(upRes.data.url);
                        }
                      } catch (uploadErr) {
                        alert('File upload failed, using fallback URL format');
                      }
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Provide Submission URL / Cloud Link</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://drive.google.com/file/d/assignment.pdf"
                  value={submissionFile}
                  onChange={(e) => setSubmissionFile(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedAssignment(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Submission
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
  tabContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.5rem',
    flexWrap: 'wrap'
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    padding: '0.6rem 1.1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    color: '#818cf8',
    border: '1px solid rgba(99, 102, 241, 0.3)'
  },
  timetableStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  dayHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.85rem'
  },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '1rem'
  },
  slotCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '0.85rem'
  },
  slotTime: {
    fontSize: '0.75rem',
    color: '#60a5fa',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontWeight: '600'
  },
  slotSubject: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0.4rem 0 0.25rem'
  },
  slotMeta: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    display: 'flex',
    gap: '0.35rem',
    alignItems: 'center'
  },
  roomPill: {
    fontSize: '0.72rem',
    color: '#818cf8',
    marginTop: '0.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px'
  },
  syllabusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.5rem'
  },
  syllabusTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0.6rem 0 1rem'
  },
  moduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  moduleBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '8px',
    padding: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  modTitle: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#818cf8',
    marginBottom: '0.35rem'
  },
  topicList: {
    paddingLeft: '1.2rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
    lineHeight: 1.5
  },
  assignmentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.5rem'
  },
  asgTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0.65rem 0 0.35rem'
  },
  asgDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.5,
    marginBottom: '1.25rem'
  },
  asgFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.75rem'
  },
  examRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  gpaBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  resultTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    color: '#cbd5e1'
  }
};

export default AcademicsPage;

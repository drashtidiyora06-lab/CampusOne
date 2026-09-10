import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Briefcase,
  Plus,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Check,
  ShieldCheck
} from 'lucide-react';

const PlacementPage = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [placementResources, setPlacementResources] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('drives');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Drive Form
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    role: '',
    ctc: '',
    minCgpa: 7.5,
    driveDate: '',
    deadlineDate: '',
    description: ''
  });

  const isPlacementAdmin = ['placement_admin', 'faculty'].includes(user?.role);

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    try {
      const [drivesRes, resRes] = await Promise.all([
        api.get('/placements/drives'),
        api.get('/placements/resources')
      ]);

      if (drivesRes.data.success) setDrives(drivesRes.data.drives);
      if (resRes.data.success) setPlacementResources(resRes.data.resources);
    } catch (err) {
      console.warn('Failed to fetch placement data');
    }
  };

  const handleApplyDrive = async (driveId) => {
    try {
      const studentCgpa = user?.cgpa || 8.85;
      const res = await api.post(`/placements/drives/${driveId}/apply`, {
        cgpa: studentCgpa
      });
      if (res.data.success) {
        fetchPlacementData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Application error');
    }
  };


  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/placements/drives', {
        ...newDrive,
        eligibleBranches: ['Computer Science', 'Information Technology']
      });
      if (res.data.success) {
        setShowCreateModal(false);
        setNewDrive({
          companyName: '',
          role: '',
          ctc: '',
          minCgpa: 7.5,
          driveDate: '',
          deadlineDate: '',
          description: ''
        });
        fetchPlacementData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating placement drive');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Placement & Career Cell</h1>
          <p className="page-subtitle">
            On-campus recruitment drives, CTC packages, eligibility tracking, and interview preparation sheets
          </p>
        </div>

        {isPlacementAdmin && (
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Post Placement Drive
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div style={styles.tabBar}>
        <button
          style={{
            ...styles.tabBtn,
            ...(activeSubTab === 'drives' ? styles.tabBtnActive : {})
          }}
          onClick={() => setActiveSubTab('drives')}
        >
          <Briefcase size={16} /> Active Placement Drives
        </button>

        <button
          style={{
            ...styles.tabBtn,
            ...(activeSubTab === 'resources' ? styles.tabBtnActive : {})
          }}
          onClick={() => setActiveSubTab('resources')}
        >
          <FileText size={16} /> Placement Resources & Resume Guides
        </button>
      </div>

      {/* SUB TAB 1: DRIVES */}
      {activeSubTab === 'drives' && (
        <div style={styles.drivesGrid}>
          {drives.map((drive) => {
            const hasApplied = drive.applicants?.some(
              (app) => app.studentId?.toString() === user?._id?.toString()
            );

            const studentCgpa = user?.cgpa || 8.85;
            const isEligible = studentCgpa >= drive.minCgpa;


            return (
              <div key={drive._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={
                        drive.logoUrl ||
                        'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=60'
                      }
                      alt={drive.companyName}
                      style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={styles.companyTitle}>{drive.companyName}</h3>
                      <div style={styles.roleSub}>{drive.role}</div>
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.85rem' }}>
                    {drive.ctc}
                  </span>
                </div>

                <p style={styles.driveDesc}>{drive.description}</p>

                <div style={styles.metaBox}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>MIN CGPA</span>
                    <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>{drive.minCgpa} CGPA</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DRIVE DATE</span>
                    <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                      {new Date(drive.driveDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>LOCATION</span>
                    <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>{drive.location}</div>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
                    {isEligible ? (
                      <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ShieldCheck size={14} /> Eligible to Apply
                      </span>
                    ) : (
                      <span style={{ color: '#f87171', fontWeight: 600 }}>Ineligible (CGPA &lt; {drive.minCgpa})</span>
                    )}
                  </div>

                  <button
                    className={hasApplied ? 'btn-secondary' : 'btn-primary'}
                    disabled={!isEligible || hasApplied}
                    onClick={() => handleApplyDrive(drive._id)}
                  >
                    {hasApplied ? <Check size={16} color="#34d399" /> : <Briefcase size={16} />}
                    {hasApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB TAB 2: PLACEMENT RESOURCES */}
      {activeSubTab === 'resources' && (
        <div style={styles.resourcesGrid}>
          {placementResources.map((res) => (
            <div key={res._id} className="card">
              <span className="badge badge-amber">{res.category}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: '0.65rem 0 0.35rem' }}>
                {res.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '1.25rem' }}>
                {res.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#60a5fa' }}>{res.company}</span>
                <button
                  className="btn-secondary"
                  onClick={() => window.open(res.fileUrl, '_blank')}
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Drive Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Post Placement Drive
            </h2>

            <form onSubmit={handleCreateDrive}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Google India"
                    value={newDrive.companyName}
                    onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Software Engineer"
                    value={newDrive.role}
                    onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">CTC / Salary Package</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 28 LPA"
                    value={newDrive.ctc}
                    onChange={(e) => setNewDrive({ ...newDrive, ctc: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Minimum CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={newDrive.minCgpa}
                    onChange={(e) => setNewDrive({ ...newDrive, minCgpa: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Drive Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newDrive.driveDate}
                    onChange={(e) => setNewDrive({ ...newDrive, driveDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newDrive.deadlineDate}
                    onChange={(e) => setNewDrive({ ...newDrive, deadlineDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role Description & Requirements</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Job profile, responsibilities, eligibility details..."
                  value={newDrive.description}
                  onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Placement Drive
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
  tabBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.75rem'
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
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff'
  },
  drivesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  companyTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  roleSub: {
    fontSize: '0.82rem',
    color: '#818cf8',
    marginTop: '0.15rem'
  },
  driveDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.4,
    margin: '1rem 0'
  },
  metaBox: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.85rem'
  },
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  }
};

export default PlacementPage;

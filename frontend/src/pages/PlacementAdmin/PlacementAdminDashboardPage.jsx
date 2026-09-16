import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Briefcase, Plus, Building2, UserCheck, ShieldCheck, Check } from 'lucide-react';

const PlacementAdminDashboardPage = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newDrive, setNewDrive] = useState({
    companyName: '',
    role: '',
    ctc: '',
    minCgpa: 7.5,
    driveDate: '',
    deadlineDate: '',
    description: '',
    location: 'Bangalore / Remote'
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/placements/drives');
      if (res.data.success) {
        setDrives(res.data.drives);
      }
    } catch (err) {
      console.warn('Error fetching drives');
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
        setNewDrive({ companyName: '', role: '', ctc: '', minCgpa: 7.5, driveDate: '', deadlineDate: '', description: '', location: 'Bangalore / Remote' });
        fetchDrives();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating placement drive');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Placement Officer Dashboard</h1>
          <p className="page-subtitle">
            Welcome, <strong>{user?.name}</strong> • Post recruitment drives, configure CTC & CGPA cutoffs, and review student applications
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Create Placement Drive
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {drives.map((drive) => (
          <div key={drive._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  {drive.companyName}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#818cf8', marginTop: '0.2rem' }}>{drive.role}</div>
              </div>
              <span className="badge badge-green">{drive.ctc}</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.85rem 0', lineHeight: 1.4 }}>
              {drive.description}
            </p>

            <div style={styles.metaBox}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>MIN CGPA</span>
                <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>{drive.minCgpa}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>DRIVE DATE</span>
                <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>
                  {new Date(drive.driveDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>APPLICANTS</span>
                <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                  {drive.applicants?.length || 0} Students
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>Create Placement Drive</h2>

            <form onSubmit={handleCreateDrive}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Microsoft"
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
                    placeholder="e.g. SDE 1"
                    value={newDrive.role}
                    onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">CTC / Package</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 24.5 LPA"
                    value={newDrive.ctc}
                    onChange={(e) => setNewDrive({ ...newDrive, ctc: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Min CGPA Cutoff</label>
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
                  <label className="form-label">Deadline Date</label>
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
                <label className="form-label">Description & Requirements</label>
                <textarea
                  className="form-textarea"
                  rows={3}
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
  metaBox: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  }
};

export default PlacementAdminDashboardPage;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Hash, BookOpen, Shield, Save, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    branch: user?.branch || 'Computer Science',
    year: user?.year || '3rd Year',
    rollNumber: user?.rollNumber || 'CS2026-104',
    bio: user?.bio || 'CampusOne Student',
    avatarUrl: user?.avatarUrl || ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(formData);
    if (res.success) {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Manage your personal details, academic branch, and roll number</p>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Column: Avatar & Summary Card */}
        <div className="card" style={{ textAlign: 'center', height: 'fit-content' }}>
          <img
            src={
              formData.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt={formData.name}
            style={styles.avatar}
          />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '0.75rem' }}>
            {formData.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.25rem 0 1rem' }}>{formData.bio}</p>

          <span className="badge badge-indigo" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
            <Shield size={14} /> Role: {user?.role ? user.role.toUpperCase() : 'STUDENT'}
          </span>

          <div style={styles.detailBox}>
            <div style={styles.detailRow}>
              <span>Email:</span> <strong>{user?.email || 'student@college.edu'}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Roll Number:</span> <strong>{formData.rollNumber}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Branch:</span> <strong>{formData.branch}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Year:</span> <strong>{formData.year}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '1.25rem' }}>
            Edit Profile Information
          </h3>

          {successMsg && (
            <div style={styles.alertSuccess}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Branch / Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Year / Semester</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Photo URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Tagline</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '1.5rem'
  },
  avatar: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #6366f1',
    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
  },
  detailBox: {
    marginTop: '1.5rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    fontSize: '0.82rem',
    textAlign: 'left',
    color: '#cbd5e1'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  alertSuccess: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    color: '#34d399',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }
};

export default ProfilePage;

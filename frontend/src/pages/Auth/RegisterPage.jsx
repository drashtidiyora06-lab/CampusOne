import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Hash, BookOpen, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    branch: 'Computer Science',
    year: '3rd Year',
    rollNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <div style={styles.brandHeader}>
          <div style={styles.logoCircle}>
            <GraduationCap size={28} color="#ffffff" />
          </div>
          <h2 style={styles.title}>Join CampusOne</h2>
          <p style={styles.subtitle}>Create your student or faculty account</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">College Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="alex@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="club_admin">Club Admin</option>
                <option value="placement_admin">Placement Cell</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Branch</label>
              <select
                className="form-select"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Tech</option>
                <option value="Electronics">Electronics (ECE)</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <div style={styles.inputWrapper}>
                <Hash size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  placeholder="CS2026-104"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Year / Level</label>
              <select
                className="form-select"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Create strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ ...styles.footerLink, marginTop: '1.25rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)'
  },
  authCard: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  logoCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
    marginBottom: '0.65rem'
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.82rem',
    color: '#94a3b8',
    marginTop: '0.2rem'
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.82rem',
    marginBottom: '1rem'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '0.85rem',
    zIndex: 2
  },
  footerLink: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: 0
  }
};

export default RegisterPage;

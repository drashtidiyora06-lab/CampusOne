import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Key, Shield } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('student');
  const [identifier, setIdentifier] = useState('STU-2026-101');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUserByRole = (role) => {
    switch (role) {
      case 'faculty':
      case 'teacher':
        navigate('/teacher/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'club_admin':
        navigate('/club-admin/dashboard');
        break;
      case 'placement_admin':
        navigate('/placement-admin/dashboard');
        break;
      default:
        navigate('/student/dashboard');
        break;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'student') setIdentifier('STU-2026-101');
    else if (tab === 'faculty') setIdentifier('FAC-CS-022');
    else if (tab === 'admin') setIdentifier('ADM-2026-001');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success && res.user) {
      redirectUserByRole(res.user.role);
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = async (demoId, demoPass, targetRole) => {
    setError('');
    setLoading(true);
    setIdentifier(demoId);
    setPassword(demoPass);
    const res = await login(demoId, demoPass);
    setLoading(false);
    if (res.success && res.user) {
      redirectUserByRole(res.user.role);
    } else {
      setError(res.message || 'Demo login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        {/* Brand */}
        <div style={styles.brandHeader}>
          <div style={styles.logoCircle}>
            <GraduationCap size={32} color="#ffffff" />
          </div>
          <h2 style={styles.title}>CampusOne v2.0 Portal</h2>
          <p style={styles.subtitle}>Role-Based Campus Management System</p>
        </div>

        {/* Tab Selection */}
        <div style={styles.tabBar}>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'student' ? styles.tabBtnActive : {}) }}
            onClick={() => handleTabChange('student')}
          >
            <UserCheck size={14} /> Student Login
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'faculty' ? styles.tabBtnActive : {}) }}
            onClick={() => handleTabChange('faculty')}
          >
            <ShieldCheck size={14} /> Teacher / Faculty
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'admin' ? styles.tabBtnActive : {}) }}
            onClick={() => handleTabChange('admin')}
          >
            <Shield size={14} /> Administrator
          </button>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              {activeTab === 'student' ? 'Student ID / Roll No. or Email' : activeTab === 'faculty' ? 'Faculty ID or Email' : 'Admin ID or Email'}
            </label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={activeTab === 'student' ? 'STU-2026-101 or student@college.edu' : activeTab === 'faculty' ? 'FAC-CS-022 or faculty@college.edu' : 'ADM-2026-001 or admin@college.edu'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating Credentials...' : `Sign In as ${activeTab.toUpperCase()}`}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={styles.divider}>
          <span>ONE-CLICK DEMO ACCOUNTS</span>
        </div>

        {/* Demo Quick Launcher Buttons */}
        <div style={styles.demoGrid}>
          <button
            type="button"
            className="btn-secondary"
            style={styles.demoBtn}
            onClick={() => handleQuickDemoLogin('STU-2026-101', 'password123', 'student')}
          >
            <span style={{ ...styles.dot, backgroundColor: '#10b981' }} /> Student
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={styles.demoBtn}
            onClick={() => handleQuickDemoLogin('FAC-CS-022', 'password123', 'faculty')}
          >
            <span style={{ ...styles.dot, backgroundColor: '#6366f1' }} /> Faculty
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={styles.demoBtn}
            onClick={() => handleQuickDemoLogin('ADM-2026-001', 'password123', 'admin')}
          >
            <span style={{ ...styles.dot, backgroundColor: '#ef4444' }} /> Admin
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={styles.demoBtn}
            onClick={() => handleQuickDemoLogin('CLB-2026-012', 'password123', 'club_admin')}
          >
            <span style={{ ...styles.dot, backgroundColor: '#8b5cf6' }} /> Club Admin
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={styles.demoBtn}
            onClick={() => handleQuickDemoLogin('PL-2026-009', 'password123', 'placement_admin')}
          >
            <span style={{ ...styles.dot, backgroundColor: '#f59e0b' }} /> Placement Admin
          </button>
        </div>

        <p style={styles.footerLink}>
          Need a new account? <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>Register New User</Link>
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
    background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)'
  },
  authCard: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '16px',
    padding: '2.25rem',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  logoCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
    marginBottom: '0.85rem'
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '0.25rem'
  },
  tabBar: {
    display: 'flex',
    gap: '0.35rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: '0.3rem',
    borderRadius: '10px',
    marginBottom: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    padding: '0.45rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
    color: '#ffffff'
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
  divider: {
    textAlign: 'center',
    margin: '1.5rem 0 0.85rem',
    fontSize: '0.65rem',
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: '0.05em'
  },
  demoGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.45rem',
    marginBottom: '1.25rem'
  },
  demoBtn: {
    fontSize: '0.72rem',
    padding: '0.35rem 0.65rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem'
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%'
  },
  footerLink: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: 0
  }
};

export default LoginPage;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@college.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
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
        {/* Brand */}
        <div style={styles.brandHeader}>
          <div style={styles.logoCircle}>
            <GraduationCap size={28} color="#ffffff" />
          </div>
          <h2 style={styles.title}>Welcome to CampusOne</h2>
          <p style={styles.subtitle}>Sign in with your college credentials</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">College Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Authenticating...' : 'Sign In to CampusOne'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={styles.divider}>
          <span>QUICK DEMO LOGINS</span>
        </div>

        <div style={styles.demoButtons}>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}
            onClick={() => {
              setEmail('student@college.edu');
              setPassword('password123');
            }}
          >
            <ShieldCheck size={14} color="#10b981" /> Student
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}
            onClick={() => {
              setEmail('clubadmin@college.edu');
              setPassword('password123');
            }}
          >
            <ShieldCheck size={14} color="#8b5cf6" /> Club Admin
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}
            onClick={() => {
              setEmail('placement@college.edu');
              setPassword('password123');
            }}
          >
            <ShieldCheck size={14} color="#f59e0b" /> Placement Cell
          </button>
        </div>

        <p style={styles.footerLink}>
          Don't have an account? <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>Create Account</Link>
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
    maxWidth: '440px',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: '16px',
    padding: '2.25rem',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
  },
  brandHeader: {
    textAlign: 'center',
    marginBottom: '1.75rem'
  },
  logoCircle: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
    marginBottom: '0.85rem'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginTop: '0.25rem'
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
    margin: '1.5rem 0 1rem',
    position: 'relative',
    fontSize: '0.65rem',
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: '0.05em'
  },
  demoButtons: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  footerLink: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: 0
  }
};

export default LoginPage;

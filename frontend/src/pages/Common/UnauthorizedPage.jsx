import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  const getHomeRoute = () => {
    switch (user?.role) {
      case 'teacher':
      case 'faculty':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'club_admin':
        return '/club-admin/dashboard';
      case 'placement_admin':
        return '/placement-admin/dashboard';
      default:
        return '/student/dashboard';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconBox}>
          <ShieldAlert size={48} color="#ef4444" />
        </div>

        <h1 style={styles.title}>403 - Access Denied</h1>
        <p style={styles.subtitle}>
          You do not have administrative permission to view this section.
        </p>

        <div style={styles.roleBox}>
          <span>Current Account Role:</span>
          <strong style={{ color: '#818cf8', textTransform: 'uppercase' }}>
            {user?.role || 'STUDENT'}
          </strong>
        </div>

        <div style={styles.btnRow}>
          <Link to={getHomeRoute()} className="btn-primary" style={{ padding: '0.65rem 1.25rem', gap: '0.5rem' }}>
            <Home size={18} /> Return to My Dashboard
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '0.65rem 1.25rem', gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Switch Login Account
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem'
  },
  card: {
    backgroundColor: '#1e293b',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '16px',
    padding: '2.5rem',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
  },
  iconBox: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    marginTop: '0.5rem',
    lineHeight: 1.5
  },
  roleBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    margin: '1.5rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: '#cbd5e1'
  },
  btnRow: {
    display: 'flex',
    gap: '0.85rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
};

export default UnauthorizedPage;

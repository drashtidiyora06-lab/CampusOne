import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Shield, LogOut, ChevronDown } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const rolesList = [
    { key: 'student', label: 'Student Role', color: '#10b981' },
    { key: 'club_admin', label: 'Club Admin Role', color: '#8b5cf6' },
    { key: 'placement_admin', label: 'Placement Admin Role', color: '#f59e0b' },
    { key: 'faculty', label: 'Faculty Role', color: '#6366f1' }
  ];

  const currentRoleObj = rolesList.find((r) => r.key === user?.role) || rolesList[0];

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      navigate(`/resources?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <header style={styles.header}>
      {/* Search Input */}
      <div style={styles.searchBox}>
        <Search size={18} color="#64748b" />
        <input
          type="text"
          placeholder="Search subjects, notes, clubs, placement drives..."
          style={styles.searchInput}
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>


      {/* Right Controls */}
      <div style={styles.controls}>
        {/* Role Switcher Pill */}
        <div style={styles.roleWrapper}>
          <button
            style={styles.roleButton}
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            title="Click to test role permissions on the fly"
          >
            <Shield size={15} color={currentRoleObj.color} />
            <span style={{ color: currentRoleObj.color, fontWeight: 600 }}>
              {currentRoleObj.label}
            </span>
            <ChevronDown size={14} color="#94a3b8" />
          </button>

          {showRoleDropdown && (
            <div style={styles.roleDropdown}>
              <div style={styles.dropdownTitle}>TEST ROLE PERMISSIONS</div>
              {rolesList.map((r) => (
                <div
                  key={r.key}
                  style={{
                    ...styles.dropdownItem,
                    ...(user?.role === r.key ? styles.dropdownItemActive : {})
                  }}
                  onClick={() => {
                    switchRole(r.key);
                    setShowRoleDropdown(false);
                  }}
                >
                  <span style={{ ...styles.dot, backgroundColor: r.color }} />
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div style={styles.notificationBtn} title="Notices & Notifications">
          <Bell size={19} color="#94a3b8" />
          <span style={styles.notificationBadge}>3</span>
        </div>

        {/* User Pill */}
        <div style={styles.userProfile}>
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt={user?.name || 'User'}
            style={styles.avatar}
          />
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name || 'Student User'}</div>
            <div style={styles.userBranch}>{user?.branch || 'Computer Science'}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button style={styles.logoutBtn} onClick={logout} title="Log Out">
          <LogOut size={17} color="#ef4444" />
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: '70px',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 40
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '0.55rem 0.85rem',
    width: '380px'
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  },
  roleWrapper: {
    position: 'relative'
  },
  roleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '0.4rem 0.85rem',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  roleDropdown: {
    position: 'absolute',
    top: '110%',
    right: 0,
    backgroundColor: '#1e293b',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    padding: '0.65rem',
    width: '210px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
    zIndex: 100
  },
  dropdownTitle: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.05em',
    padding: '0.35rem 0.5rem',
    marginBottom: '0.35rem'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    padding: '0.5rem',
    borderRadius: '6px',
    fontSize: '0.82rem',
    color: '#cbd5e1',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#ffffff',
    fontWeight: '600'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  notificationBtn: {
    position: 'relative',
    cursor: 'pointer',
    padding: '0.4rem',
    borderRadius: '8px',
    transition: 'background 0.2s ease'
  },
  notificationBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: '700',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingLeft: '0.75rem',
    borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(99, 102, 241, 0.5)'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#f8fafc',
    lineHeight: 1.2
  },
  userBranch: {
    fontSize: '0.72rem',
    color: '#94a3b8'
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }
};

export default Header;

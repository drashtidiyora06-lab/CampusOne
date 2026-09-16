import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bell,
  BookOpen,
  FolderDown,
  Compass,
  Users,
  Briefcase,
  FileCheck2,
  CheckSquare,
  User,
  GraduationCap,
  Shield,
  FileText,
  UserCheck
} from 'lucide-react';

const Sidebar = () => {

  const { user } = useAuth();

  const getNavItems = () => {
    const role = user?.role || 'student';

    if (role === 'faculty' || role === 'teacher') {
      return [
        { label: 'Faculty Portal', path: '/teacher/dashboard', icon: LayoutDashboard },
        { label: 'Submissions & Grading', path: '/teacher/submissions', icon: FileCheck2 },
        { label: 'Class Academics', path: '/academics', icon: BookOpen },
        { label: 'Study Resources', path: '/resources', icon: FolderDown },
        { label: 'Campus Notices', path: '/notices', icon: Bell },
        { label: 'Campus Guide', path: '/campus-guide', icon: Compass },
        { label: 'My Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'Admin Control Panel', path: '/admin/dashboard', icon: Shield },
        { label: 'Service Request Approvals', path: '/services', icon: FileCheck2 },
        { label: 'Notices & Banners', path: '/notices', icon: Bell },
        { label: 'Academic Courses', path: '/academics', icon: BookOpen },
        { label: 'Study Resources', path: '/resources', icon: FolderDown },
        { label: 'Campus Directory', path: '/campus-guide', icon: Compass },
        { label: 'Clubs & Societies', path: '/clubs', icon: Users },
        { label: 'Placement Drives', path: '/placements', icon: Briefcase },
        { label: 'My Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'club_admin') {
      return [
        { label: 'Club Workspace', path: '/club-admin/dashboard', icon: LayoutDashboard },
        { label: 'Clubs Directory', path: '/clubs', icon: Users },
        { label: 'Announcements', path: '/notices', icon: Bell },
        { label: 'My Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'placement_admin') {
      return [
        { label: 'Placement Officer', path: '/placement-admin/dashboard', icon: LayoutDashboard },
        { label: 'Active Placement Drives', path: '/placements', icon: Briefcase },
        { label: 'Announcements', path: '/notices', icon: Bell },
        { label: 'My Profile', path: '/profile', icon: User }
      ];
    }

    // Default Student Navigation
    return [
      { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { label: 'Notices', path: '/notices', icon: Bell },
      { label: 'Academics', path: '/academics', icon: BookOpen },
      { label: 'Resources', path: '/resources', icon: FolderDown },
      { label: 'Campus Guide', path: '/campus-guide', icon: Compass },
      { label: 'Clubs & Events', path: '/clubs', icon: Users },
      { label: 'Placements', path: '/placements', icon: Briefcase },
      { label: 'Student Services', path: '/services', icon: FileCheck2 },
      { label: 'Productivity', path: '/productivity', icon: CheckSquare },
      { label: 'My Profile', path: '/profile', icon: User }
    ];
  };

  const navItems = getNavItems();

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandContainer}>
        <div style={styles.brandIcon}>
          <GraduationCap size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={styles.brandTitle}>CampusOne</h1>
          <span style={styles.brandSubtitle}>v2.0 Monorepo</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={styles.navMenu}>
        <div style={styles.sectionLabel}>
          {user?.role ? `${user.role.toUpperCase()} NAVIGATION` : 'STUDENT NAVIGATION'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {})
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info */}
      <div style={styles.footer}>
        <div style={styles.footerBadge}>CampusOne v2.0 Platform</div>
        <div style={styles.footerText}>© 2026 CampusOne</div>
      </div>
    </aside>
  );
};


const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#1e293b',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    flexShrink: 0
  },
  brandContainer: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  brandIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.2
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '500'
  },
  navMenu: {
    padding: '1.25rem 0.85rem',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  sectionLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.08em',
    padding: '0.5rem 0.75rem',
    marginBottom: '0.25rem'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.7rem 0.85rem',
    borderRadius: '8px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  navLinkActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontWeight: '600',
    border: '1px solid rgba(99, 102, 241, 0.25)'
  },
  footer: {
    padding: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center'
  },
  footerBadge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    color: '#94a3b8',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    marginBottom: '0.4rem'
  },
  footerText: {
    fontSize: '0.75rem',
    color: '#64748b'
  }
};

export default Sidebar;

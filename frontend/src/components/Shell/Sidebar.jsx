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
  Clock,
  ClipboardList,
  Building,
  BarChart3,
  History
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    const role = user?.role || 'student';

    if (role === 'faculty' || role === 'teacher') {
      return [
        { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
        { label: 'My Teaching Assignments', path: '/teacher/dashboard#assignments', icon: ClipboardList },
        { label: 'My Classes', path: '/teacher/dashboard#classes', icon: Users },
        { label: 'Marks Management', path: '/teacher/marks', icon: FileCheck2 },
        { label: 'Attendance Management', path: '/teacher/attendance', icon: Clock },
        { label: 'Assignments', path: '/teacher/dashboard#assignments-list', icon: FileText },
        { label: 'Study Resources', path: '/resources', icon: FolderDown },
        { label: 'My Timetable', path: '/academics', icon: BookOpen },
        { label: 'Faculty Requests', path: '/teacher/requests', icon: Building },
        { label: 'Notices', path: '/notices', icon: Bell },
        { label: 'Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Student Management', path: '/admin/dashboard#students', icon: Users },
        { label: 'Faculty Management', path: '/admin/dashboard#faculty', icon: GraduationCap },
        { label: 'Academic Management', path: '/admin/academics', icon: BookOpen },
        { label: 'Marks & Results', path: '/admin/academics#results', icon: FileCheck2 },
        { label: 'Attendance', path: '/admin/academics#attendance', icon: Clock },
        { label: 'Timetable', path: '/admin/academics#timetable', icon: Clock },
        { label: 'Student Requests', path: '/admin/requests?tab=student', icon: FileText },
        { label: 'Faculty Requests', path: '/admin/requests?tab=faculty', icon: Building },
        { label: 'Clubs & Teacher In-Charge', path: '/clubs', icon: Users },
        { label: 'Placement Management', path: '/placements', icon: Briefcase },
        { label: 'Notices', path: '/notices', icon: Bell },
        { label: 'Resources', path: '/resources', icon: FolderDown },
        { label: 'Campus Directory', path: '/campus-guide', icon: Compass },
        { label: 'Reports', path: '/admin/dashboard#reports', icon: BarChart3 },
        { label: 'Audit', path: '/admin/dashboard#audit', icon: History },
        { label: 'Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'club_admin') {
      return [
        { label: 'Dashboard', path: '/club-admin/dashboard', icon: LayoutDashboard },
        { label: 'My Club', path: '/clubs', icon: Users },
        { label: 'Members', path: '/club-admin/dashboard#members', icon: Users },
        { label: 'Events', path: '/club-admin/dashboard#events', icon: Bell },
        { label: 'Activities', path: '/club-admin/dashboard#activities', icon: ClipboardList },
        { label: 'Announcements', path: '/notices', icon: Bell },
        { label: 'Profile', path: '/profile', icon: User }
      ];
    }

    if (role === 'placement_admin') {
      return [
        { label: 'Dashboard', path: '/placement-admin/dashboard', icon: LayoutDashboard },
        { label: 'Placement Drives', path: '/placements', icon: Briefcase },
        { label: 'Applications', path: '/placement-admin/dashboard#applications', icon: FileText },
        { label: 'Eligibility', path: '/placement-admin/dashboard#eligibility', icon: FileCheck2 },
        { label: 'Companies', path: '/placement-admin/dashboard#companies', icon: Building },
        { label: 'Analytics', path: '/placement-admin/dashboard#analytics', icon: BarChart3 },
        { label: 'Notices', path: '/notices', icon: Bell },
        { label: 'Profile', path: '/profile', icon: User }
      ];
    }

    // STUDENT
    return [
      { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { label: 'Academics', path: '/academics', icon: BookOpen },
      { label: 'Timetable', path: '/academics?tab=timetable', icon: Clock },
      { label: 'Attendance', path: '/student/dashboard#attendance', icon: Clock },
      { label: 'Marks & Results', path: '/student/results', icon: FileCheck2 },
      { label: 'Assignments', path: '/academics?tab=assignments', icon: FileText },
      { label: 'Resources', path: '/resources', icon: FolderDown },
      { label: 'Campus Guide', path: '/campus-guide', icon: Compass },
      { label: 'Clubs & Events', path: '/clubs', icon: Users },
      { label: 'Placements', path: '/placements', icon: Briefcase },
      { label: 'Student Services', path: '/services', icon: FileText },
      { label: 'Notices', path: '/notices', icon: Bell },
      { label: 'Productivity', path: '/productivity', icon: CheckSquare },
      { label: 'Profile', path: '/profile', icon: User }
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
          <span style={styles.brandSubtitle}>Management Platform</span>
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
        <div style={styles.footerBadge}>CampusOne Core</div>
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

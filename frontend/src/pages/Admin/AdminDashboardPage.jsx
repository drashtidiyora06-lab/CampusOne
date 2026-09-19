import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Users,
  ShieldCheck,
  FileCheck2,
  Bell,
  Building,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Key,
  Ban,
  Check
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({ studentCount: 0, facultyCount: 0, adminCount: 0, pendingServiceRequests: 0, activeDrives: 0, totalNotices: 0 });

  // Data lists
  const [users, setUsers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [serviceRequests, setServiceRequests] = useState([]);

  // User Create Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'student',
    branch: 'Computer Science',
    rollNumber: '',
    studentId: '',
    facultyId: '',
    adminId: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, [userRoleFilter, userSearchTerm]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, servicesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?role=${userRoleFilter}&search=${userSearchTerm}`),
        api.get('/services')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (servicesRes.data.success) setServiceRequests(servicesRes.data.requests);
    } catch (err) {
      console.warn('Admin data fetch error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', newUser);
      if (res.data.success) {
        setShowAddUserModal(false);
        setNewUser({ name: '', email: '', password: 'password123', role: 'student', branch: 'Computer Science', rollNumber: '', studentId: '', facultyId: '', adminId: '' });
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleUpdateServiceStatus = async (id, status, remark) => {
    try {
      const res = await api.put(`/services/${id}/status`, {
        status,
        adminRemark: remark || `Marked as ${status} by Administrator`
      });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus Administrator Control Panel</h1>
          <p className="page-subtitle">
            User management, service request approvals, system settings, and institutional analytics
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddUserModal(true)}>
          <UserPlus size={16} /> Create User Account
        </button>
      </div>

      {/* Admin Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconBox}>
            <Users size={22} color="#818cf8" />
          </div>
          <div>
            <div style={styles.statVal}>{stats.studentCount}</div>
            <div style={styles.statLabel}>Enrolled Students</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(52, 211, 153, 0.15)' }}>
            <ShieldCheck size={22} color="#34d399" />
          </div>
          <div>
            <div style={styles.statVal}>{stats.facultyCount}</div>
            <div style={styles.statLabel}>Faculty Members</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
            <FileCheck2 size={22} color="#ef4444" />
          </div>
          <div>
            <div style={styles.statVal}>{stats.pendingServiceRequests}</div>
            <div style={styles.statLabel}>Pending Requests</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBox, backgroundColor: 'rgba(251, 191, 36, 0.15)' }}>
            <Bell size={22} color="#fbbf24" />
          </div>
          <div>
            <div style={styles.statVal}>{stats.totalNotices}</div>
            <div style={styles.statLabel}>Published Notices</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabBar}>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'users' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} /> User Management ({users.length})
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'services' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('services')}
        >
          <FileCheck2 size={16} /> Service Requests Approval ({serviceRequests.length})
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="card">
          <div style={styles.filterRow}>
            <div style={styles.searchWrapper}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search user by name, email, ID, or roll number..."
                style={styles.searchInput}
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'student', 'faculty', 'admin'].map((role) => (
                <button
                  key={role}
                  style={{
                    ...styles.rolePill,
                    ...(userRoleFilter === role ? styles.rolePillActive : {})
                  }}
                  onClick={() => setUserRoleFilter(role)}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>ID / Roll No.</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{u.email}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'badge-red'
                          : u.role === 'faculty'
                          ? 'badge-amber'
                          : u.role === 'student'
                          ? 'badge-green'
                          : 'badge-indigo'
                      }`}
                      style={{ textTransform: 'uppercase' }}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {u.studentId || u.facultyId || u.adminId || u.rollNumber || '-'}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{u.branch || u.department || 'Computer Science'}</td>
                  <td>
                    <span className={`badge ${u.isActive !== false ? 'badge-green' : 'badge-red'}`}>
                      {u.isActive !== false ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={u.isActive !== false ? 'btn-secondary' : 'btn-primary'}
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', gap: '0.3rem' }}
                      onClick={() => handleToggleUserStatus(u._id)}
                    >
                      {u.isActive !== false ? <Ban size={12} color="#ef4444" /> : <Check size={12} />}
                      {u.isActive !== false ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: SERVICE REQUESTS APPROVAL */}
      {activeTab === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {serviceRequests.map((req) => (
            <div key={req._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-indigo" style={{ textTransform: 'uppercase' }}>
                    {req.requestType.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Ref #{req._id.slice(-6)} • {new Date(req.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  {req.subject}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>{req.details}</p>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Student: {req.userName} ({req.rollNumber})
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge ${req.status === 'approved' ? 'badge-green' : req.status === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                  {req.status.toUpperCase()}
                </span>

                {req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      onClick={() => handleUpdateServiceStatus(req._id, 'approved', 'Approved by Campus Admin')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderColor: '#ef4444', color: '#f87171' }}
                      onClick={() => handleUpdateServiceStatus(req._id, 'rejected', 'Rejected by Campus Admin')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>Create New Account</h2>

            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Robert Vance"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@college.edu"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty / Teacher</option>
                    <option value="admin">Administrator</option>
                    <option value="club_admin">Club Admin</option>
                    <option value="placement_admin">Placement Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">User ID / Roll Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. STU-2026-99 or FAC-CS-101"
                    value={newUser.studentId || newUser.facultyId || newUser.adminId || newUser.rollNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewUser({
                        ...newUser,
                        rollNumber: val,
                        studentId: val,
                        facultyId: val,
                        adminId: val
                      });
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.75rem'
  },
  statCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statVal: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  statLabel: {
    fontSize: '0.78rem',
    color: '#94a3b8'
  },
  tabBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem'
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
    cursor: 'pointer'
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff'
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '0.4rem 0.75rem',
    width: '320px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%'
  },
  rolePill: {
    background: 'none',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    padding: '0.3rem 0.65rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  rolePillActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    color: '#cbd5e1'
  }
};

export default AdminDashboardPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Bell, Plus, Search, Filter, AlertTriangle, Calendar, User, Tag } from 'lucide-react';

const NoticesPage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Notice form state
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'general',
    targetAudience: 'All Students',
    isImportant: false
  });

  const canPostNotice = ['faculty', 'club_admin', 'placement_admin'].includes(user?.role);

  useEffect(() => {
    fetchNotices();
  }, [categoryFilter]);

  const fetchNotices = async () => {
    try {
      const res = await api.get(`/notices?category=${categoryFilter}`);
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      console.warn('Failed to fetch notices');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices', newNotice);
      if (res.data.success) {
        setShowModal(false);
        setNewNotice({ title: '', content: '', category: 'general', targetAudience: 'All Students', isImportant: false });
        fetchNotices();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting notice');
    }
  };

  const filteredNotices = notices.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Notices & Announcements</h1>
          <p className="page-subtitle">Official campus updates, exam alerts, and club bulletins</p>
        </div>

        {canPostNotice && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Post New Notice
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            className="form-input"
            style={{ border: 'none', background: 'none' }}
            placeholder="Search notices by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.categoryPills}>
          {['all', 'academic', 'placement', 'club', 'general'].map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.pillBtn,
                ...(categoryFilter === cat ? styles.pillBtnActive : {})
              }}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Feed */}
      <div style={styles.noticeGrid}>
        {filteredNotices.map((notice) => (
          <div
            key={notice._id}
            className="card"
            style={{
              borderColor: notice.isImportant ? 'rgba(239, 68, 68, 0.4)' : undefined,
              position: 'relative'
            }}
          >
            {notice.isImportant && (
              <div style={styles.importantTag}>
                <AlertTriangle size={12} color="#ffffff" /> IMPORTANT
              </div>
            )}

            <div style={styles.cardTopRow}>
              <span
                className={`badge ${
                  notice.category === 'academic'
                    ? 'badge-indigo'
                    : notice.category === 'placement'
                    ? 'badge-amber'
                    : notice.category === 'club'
                    ? 'badge-green'
                    : 'badge-blue'
                }`}
              >
                {notice.category}
              </span>
              <span style={styles.dateText}>
                <Calendar size={13} />{' '}
                {new Date(notice.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <h3 style={styles.noticeTitle}>{notice.title}</h3>
            <p style={styles.noticeContent}>{notice.content}</p>

            <div style={styles.cardFooter}>
              <div style={styles.authorBadge}>
                <User size={14} color="#818cf8" />
                <span>
                  {notice.authorName} ({notice.authorRole})
                </span>
              </div>
              <div style={styles.targetBadge}>
                <Tag size={13} color="#94a3b8" />
                <span>{notice.targetAudience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Post Official Notice
            </h2>

            <form onSubmit={handleCreateNotice}>
              <div className="form-group">
                <label className="form-label">Notice Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Workshop Registration Deadline"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="placement">Placement</option>
                    <option value="club">Club</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 3rd Year CS"
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notice Content</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Provide complete notice details..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="importantCheck"
                  checked={newNotice.isImportant}
                  onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                />
                <label htmlFor="importantCheck" style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  Mark as High Priority / Urgent Notice
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Notice
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
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: '0.85rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '1.75rem'
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
  categoryPills: {
    display: 'flex',
    gap: '0.5rem'
  },
  pillBtn: {
    background: 'none',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  pillBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff'
  },
  noticeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.5rem'
  },
  importantTag: {
    position: 'absolute',
    top: '-10px',
    right: '15px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: '800',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  dateText: {
    fontSize: '0.78rem',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  noticeTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.5rem',
    lineHeight: 1.3
  },
  noticeContent: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    lineHeight: 1.5,
    marginBottom: '1.25rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.85rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '0.78rem'
  },
  authorBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: '#cbd5e1',
    fontWeight: '500'
  },
  targetBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    color: '#64748b'
  }
};

export default NoticesPage;

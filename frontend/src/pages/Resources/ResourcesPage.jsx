import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FolderDown,
  Search,
  Plus,
  FileText,
  Download,
  Filter,
  User,
  Calendar
} from 'lucide-react';

const ResourcesPage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload modal state
  const [newResource, setNewResource] = useState({
    title: '',
    subject: 'Database Management Systems',
    semester: 'Semester 6',
    category: 'Lecture Notes',
    fileUrl: '',
    fileName: ''
  });

  const canUpload = ['faculty', 'club_admin', 'placement_admin'].includes(user?.role);

  useEffect(() => {
    fetchResources();
  }, [semesterFilter, categoryFilter, searchTerm]);


  const fetchResources = async () => {
    try {
      let query = `/resources?search=${searchTerm}`;
      if (semesterFilter !== 'all') query += `&semester=${semesterFilter}`;
      if (categoryFilter !== 'all') query += `&category=${categoryFilter}`;

      const res = await api.get(query);
      if (res.data.success) {
        setResources(res.data.resources);
      }
    } catch (err) {
      console.warn('Failed to fetch study resources');
    }
  };

  const handleDownload = async (resource) => {
    try {
      await api.put(`/resources/${resource._id}/download`);
      window.open(resource.fileUrl, '_blank');
      fetchResources();
    } catch (err) {
      window.open(resource.fileUrl, '_blank');
    }
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/resources', newResource);
      if (res.data.success) {
        setShowUploadModal(false);
        setNewResource({
          title: '',
          subject: 'Database Management Systems',
          semester: 'Semester 6',
          category: 'Lecture Notes',
          fileUrl: '',
          fileName: ''
        });
        fetchResources();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading resource');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Resource Repository</h1>
          <p className="page-subtitle">
            Curated lecture notes, previous year question papers (PYQs), and lab manuals
          </p>
        </div>

        {canUpload && (
          <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
            <Plus size={18} /> Upload Resource
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            className="form-input"
            style={{ border: 'none', background: 'none' }}
            placeholder="Search notes by subject or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: '150px' }}
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="all">All Semesters</option>
            <option value="Semester 5">Semester 5</option>
            <option value="Semester 6">Semester 6</option>
            <option value="Semester 7">Semester 7</option>
          </select>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="PYQs">PYQs</option>
            <option value="Lab Manual">Lab Manual</option>
            <option value="Question Bank">Question Bank</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div style={styles.resourceGrid}>
        {resources.map((res) => (
          <div key={res._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-indigo">{res.category}</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{res.semester}</span>
            </div>

            <div style={styles.fileIconRow}>
              <div style={styles.fileIconBox}>
                <FileText size={24} color="#818cf8" />
              </div>
              <div>
                <h3 style={styles.resTitle}>{res.title}</h3>
                <div style={styles.resSub}>{res.subject}</div>
              </div>
            </div>

            <div style={styles.metaRow}>
              <span>Size: {res.fileSize}</span>
              <span>•</span>
              <span>Uploaded by {res.uploadedByName}</span>
            </div>

            <div style={styles.cardFooter}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                {res.downloadsCount} Downloads
              </div>

              <button
                className="btn-primary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                onClick={() => handleDownload(res)}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Upload Academic Resource
            </h2>

            <form onSubmit={handleUploadResource}>
              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. DBMS Normalization Cheat Sheet"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Database Management Systems"
                    value={newResource.subject}
                    onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="PYQs">PYQs</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Question Bank">Question Bank</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Document PDF Link / Storage URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  value={newResource.fileUrl}
                  onChange={(e) => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload Resource
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
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
    gap: '1.5rem'
  },
  fileIconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    margin: '1rem 0 0.75rem'
  },
  fileIconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  resTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  resSub: {
    fontSize: '0.8rem',
    color: '#60a5fa',
    marginTop: '0.2rem'
  },
  metaRow: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    display: 'flex',
    gap: '0.4rem',
    marginBottom: '1.25rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.85rem'
  }
};

export default ResourcesPage;

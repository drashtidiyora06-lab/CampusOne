import React, { useState, useEffect } from 'react';
import { Building, Plus, AlertCircle, CheckCircle, Clock, Send } from 'lucide-react';
import api from '../../services/api';

export default function FacultyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    requestType: 'classroom_equipment',
    subject: '',
    details: '',
    priority: 'Medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faculty-requests/my');
      if (res.data.success) {
        setRequests(res.data.requests || []);
      } else {
        setError(res.data.message || 'Failed to load requests');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/faculty-requests', formData);
      if (res.data.success) {
        setSuccessMsg('Administrative Faculty Request submitted successfully!');
        setFormData({ requestType: 'classroom_equipment', subject: '', details: '', priority: 'Medium' });
        setShowModal(false);
        fetchRequests();
      } else {
        setError(res.data.message || 'Failed to submit request');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'resolved':
        return <span style={{ ...styles.badge, backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>Approved / Resolved</span>;
      case 'rejected':
        return <span style={{ ...styles.badge, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>Rejected</span>;
      case 'processing':
        return <span style={{ ...styles.badge, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>Processing</span>;
      default:
        return <span style={{ ...styles.badge, backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#facc15' }}>Pending</span>;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Faculty Administrative Requests</h1>
          <p style={styles.subtitle}>Submit and track classroom, equipment, resource, and administrative requests to Campus Administration.</p>
        </div>
        <button style={styles.createBtn} onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Request
        </button>
      </div>

      {successMsg && (
        <div style={styles.alertSuccess}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {error && (
        <div style={styles.alertError}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading Faculty Requests...</div>
      ) : requests.length === 0 ? (
        <div style={styles.emptyState}>
          <Building size={48} color="#64748b" />
          <h3>No Faculty Requests Submitted</h3>
          <p>Need classroom equipment, lab maintenance, or administrative support? Submit a request to get started.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {requests.map((req) => (
            <div key={req._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.typeTag}>{req.requestType.replace('_', ' ').toUpperCase()}</span>
                {getStatusBadge(req.status)}
              </div>
              <h3 style={styles.cardTitle}>{req.subject}</h3>
              <p style={styles.cardDetails}>{req.details}</p>
              <div style={styles.metaRow}>
                <span>Priority: <strong>{req.priority}</strong></span>
                <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
              {req.adminRemark && (
                <div style={styles.remarkBox}>
                  <strong>Admin Remark:</strong> {req.adminRemark}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Submit Administrative Faculty Request</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Request Category</label>
                <select
                  style={styles.select}
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                >
                  <option value="classroom_equipment">Classroom / AV Equipment</option>
                  <option value="lab_equipment">Lab Equipment & Hardware</option>
                  <option value="academic_resources">Academic Study Resources</option>
                  <option value="timetable_correction">Timetable Adjustment</option>
                  <option value="maintenance">Facility Maintenance</option>
                  <option value="department_request">Departmental Administrative Support</option>
                  <option value="leave_admin">Faculty Leave / Official Request</option>
                  <option value="other">Other Administrative Request</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Priority Level</label>
                <select
                  style={styles.select}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Subject / Summary</label>
                <input
                  type="text"
                  required
                  style={styles.input}
                  placeholder="e.g. Projector replacement in Room 301"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Detailed Explanation</label>
                <textarea
                  required
                  rows={4}
                  style={styles.textarea}
                  placeholder="Describe the exact requirements and justification..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn} disabled={submitting}>
                  <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#f8fafc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.875rem', fontWeight: 700, margin: 0 },
  subtitle: { color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' },
  createBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#6366f1', color: '#ffffff',
    border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
  },
  alertSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  alertError: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  loading: { textAlign: 'center', padding: '3rem', color: '#94a3b8' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  typeTag: { fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: '0.25rem 0.5rem', borderRadius: '4px' },
  badge: { fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '9999px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 600, margin: 0 },
  cardDetails: { fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 },
  metaRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' },
  remarkBox: { marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '6px', fontSize: '0.85rem', color: '#cbd5e1', borderLeft: '3px solid #6366f1' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalContent: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '550px', border: '1px solid rgba(255,255,255,0.1)' },
  modalTitle: { margin: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' },
  input: { padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem' },
  select: { padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem' },
  textarea: { padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
  cancelBtn: { padding: '0.65rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: '#6366f1', border: 'none', color: '#ffffff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }
};

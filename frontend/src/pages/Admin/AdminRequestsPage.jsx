import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Clock, FileText, Building, Send } from 'lucide-react';
import api from '../../services/api';

export default function AdminRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'faculty' ? 'faculty' : 'student';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [studentRequests, setStudentRequests] = useState([]);
  const [facultyRequests, setFacultyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [statusVal, setStatusVal] = useState('processing');
  const [remarkVal, setRemarkVal] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [stuRes, facRes] = await Promise.all([
        api.get('/services'),
        api.get('/faculty-requests/all')
      ]);

      if (stuRes.data.success) setStudentRequests(stuRes.data.requests || []);
      if (facRes.data.success) setFacultyRequests(facRes.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'faculty' || tabParam === 'student') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    try {
      setUpdating(true);
      const isStudentReq = activeTab === 'student';
      const endpoint = isStudentReq
        ? `/services/${selectedReq._id}/status`
        : `/faculty-requests/${selectedReq._id}/status`;

      const res = await api.put(endpoint, {
        status: statusVal,
        adminRemark: remarkVal
      });

      if (res.data.success) {
        setSelectedReq(null);
        setRemarkVal('');
        fetchData();
      } else {
        alert(res.data.message || 'Failed to update status');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setUpdating(false);
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

  const currentList = activeTab === 'student' ? studentRequests : facultyRequests;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Institutional Request Management</h1>
          <p style={styles.subtitle}>Review, process, approve, or resolve Student Services and Faculty Administrative Requests.</p>
        </div>
      </div>

      {/* Tab Controls */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'student' ? styles.tabBtnActive : {}) }}
          onClick={() => handleTabChange('student')}
        >
          <FileText size={18} /> Student Services Requests ({studentRequests.filter(r => r.status === 'pending').length} Pending)
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'faculty' ? styles.tabBtnActive : {}) }}
          onClick={() => handleTabChange('faculty')}
        >
          <Building size={18} /> Faculty Administrative Requests ({facultyRequests.filter(r => r.status === 'pending').length} Pending)
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading requests...</div>
      ) : currentList.length === 0 ? (
        <div style={styles.emptyState}>
          <Shield size={48} color="#64748b" />
          <h3>No {activeTab === 'student' ? 'Student' : 'Faculty'} Requests Found</h3>
          <p>No requests have been submitted in this category yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {currentList.map((req) => (
            <div key={req._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.userTag}>
                  {activeTab === 'student' ? `Student: ${req.userName} (${req.rollNumber})` : `Faculty: ${req.userName} (${req.department})`}
                </span>
                {getStatusBadge(req.status)}
              </div>
              <h3 style={styles.cardTitle}>{req.subject}</h3>
              <p style={styles.cardDetails}>{req.details}</p>
              <div style={styles.metaRow}>
                <span>Type: <strong>{req.requestType.replace('_', ' ')}</strong></span>
                <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
              {req.adminRemark && (
                <div style={styles.remarkBox}>
                  <strong>Admin Remark:</strong> {req.adminRemark}
                </div>
              )}
              <button
                style={styles.actionBtn}
                onClick={() => {
                  setSelectedReq(req);
                  setStatusVal(req.status === 'pending' ? 'processing' : req.status);
                  setRemarkVal(req.adminRemark || '');
                }}
              >
                Process Request
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Process Modal */}
      {selectedReq && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Process {activeTab === 'student' ? 'Student' : 'Faculty'} Request</h2>
            <div style={styles.reqInfo}>
              <p><strong>Applicant:</strong> {selectedReq.userName}</p>
              <p><strong>Subject:</strong> {selectedReq.subject}</p>
              <p><strong>Details:</strong> {selectedReq.details}</p>
            </div>
            <form onSubmit={handleProcess} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Update Action / Status</label>
                <select
                  style={styles.select}
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                >
                  <option value="processing">Mark as Processing</option>
                  <option value="approved">Approve Request</option>
                  <option value="rejected">Reject Request</option>
                  <option value="resolved">Mark as Resolved / Complete</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Admin Remarks & Instructions</label>
                <textarea
                  rows={3}
                  style={styles.textarea}
                  placeholder="Enter remarks visible to applicant..."
                  value={remarkVal}
                  onChange={(e) => setRemarkVal(e.target.value)}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setSelectedReq(null)}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn} disabled={updating}>
                  <Send size={16} /> {updating ? 'Saving...' : 'Save Decision'}
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
  header: { marginBottom: '1.5rem' },
  title: { fontSize: '1.875rem', fontWeight: 700, margin: 0 },
  subtitle: { color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' },
  tabBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', color: '#94a3b8',
    border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
  },
  tabBtnActive: { backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' },
  loading: { textAlign: 'center', padding: '3rem', color: '#94a3b8' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  userTag: { fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' },
  badge: { fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '9999px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 600, margin: 0 },
  cardDetails: { fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 },
  metaRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' },
  remarkBox: { marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '6px', fontSize: '0.85rem', color: '#cbd5e1', borderLeft: '3px solid #6366f1' },
  actionBtn: { marginTop: '0.5rem', padding: '0.65rem', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalContent: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '550px', border: '1px solid rgba(255,255,255,0.1)' },
  modalTitle: { margin: 0, marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 },
  reqInfo: { backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' },
  select: { padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem' },
  textarea: { padding: '0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
  cancelBtn: { padding: '0.65rem 1.25rem', backgroundColor: 'transparent', border: '1px solid #475569', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: '#6366f1', border: 'none', color: '#ffffff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }
};

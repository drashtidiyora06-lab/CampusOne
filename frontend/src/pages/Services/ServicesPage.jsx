import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FileCheck2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Home,
  Receipt
} from 'lucide-react';

const ServicesPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // New Request Form
  const [newRequest, setNewRequest] = useState({
    requestType: 'bonafide',
    subject: '',
    details: ''
  });

  const isAdmin = ['faculty', 'placement_admin'].includes(user?.role);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/services');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.warn('Failed to fetch service requests');
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/services', newRequest);
      if (res.data.success) {
        setShowModal(false);
        setNewRequest({ requestType: 'bonafide', subject: '', details: '' });
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting request');
    }
  };

  const handleUpdateStatus = async (id, status, remark) => {
    try {
      const res = await api.put(`/services/${id}/status`, {
        status,
        adminRemark: remark || `Marked as ${status} by admin`
      });
      if (res.data.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case 'id_card': return CreditCard;
      case 'bonafide': return FileText;
      case 'hostel_complaint': return Home;
      case 'fee_receipt': return Receipt;
      default: return FileCheck2;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Services Portal</h1>
          <p className="page-subtitle">
            Submit administrative applications for ID cards, bonafide certificates, hostel complaints, and fee receipts
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Submit New Request
        </button>
      </div>

      {/* Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {requests.map((req) => {
          const Icon = getServiceTypeIcon(req.requestType);

          return (
            <div key={req._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color="#818cf8" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="badge badge-indigo" style={{ textTransform: 'uppercase' }}>
                      {req.requestType.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Ref: #{req._id.substring(req._id.length - 6)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {req.subject}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.35rem', lineHeight: 1.4 }}>
                    {req.details}
                  </p>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.45rem' }}>
                    Submitted by: {req.userName} ({req.rollNumber}) • {new Date(req.createdAt).toLocaleString()}
                  </div>

                  {req.adminRemark && (
                    <div style={{ fontSize: '0.8rem', color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '0.4rem 0.65rem', borderRadius: '6px', marginTop: '0.65rem', display: 'inline-block' }}>
                      Remark: {req.adminRemark}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.65rem' }}>
                <span
                  className={`badge ${
                    req.status === 'approved'
                      ? 'badge-green'
                      : req.status === 'rejected'
                      ? 'badge-red'
                      : 'badge-amber'
                  }`}
                  style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
                >
                  {req.status === 'approved' && <CheckCircle2 size={14} />}
                  {req.status === 'rejected' && <XCircle size={14} />}
                  {req.status === 'pending' && <Clock size={14} />}
                  {req.status.toUpperCase()}
                </span>

                {isAdmin && req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => handleUpdateStatus(req._id, 'approved', 'Approved by Admin')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderColor: '#ef4444', color: '#f87171' }}
                      onClick={() => handleUpdateStatus(req._id, 'rejected', 'Rejected by Admin')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Submit Administrative Request
            </h2>

            <form onSubmit={handleCreateRequest}>
              <div className="form-group">
                <label className="form-label">Request Type</label>
                <select
                  className="form-select"
                  value={newRequest.requestType}
                  onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
                >
                  <option value="bonafide">Bonafide Certificate</option>
                  <option value="id_card">ID Card Reissue</option>
                  <option value="hostel_complaint">Hostel / Maintenance Complaint</option>
                  <option value="fee_receipt">Official Fee Receipt Request</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bonafide Letter for Bank Loan"
                  value={newRequest.subject}
                  onChange={(e) => setNewRequest({ ...newRequest, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Request Details & Justification</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Provide complete explanation..."
                  value={newRequest.details}
                  onChange={(e) => setNewRequest({ ...newRequest, details: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;

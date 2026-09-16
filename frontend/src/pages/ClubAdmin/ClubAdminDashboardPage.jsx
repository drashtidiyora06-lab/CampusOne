import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Users, Calendar, Plus, MapPin, Sparkles, UserCheck } from 'lucide-react';

const ClubAdminDashboardPage = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', venue: '', imageUrl: '' });

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await api.get('/clubs');
      if (res.data.success) {
        setClubs(res.data.clubs);
        if (res.data.clubs.length > 0) {
          setSelectedClub(res.data.clubs[0]);
        }
      }
    } catch (err) {
      console.warn('Error fetching clubs');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!selectedClub) return;
    try {
      const res = await api.post(`/clubs/${selectedClub._id}/events`, newEvent);
      if (res.data.success) {
        setShowAddEventModal(false);
        setNewEvent({ title: '', description: '', date: '', venue: '', imageUrl: '' });
        fetchClubs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing event');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Club & Society Administrator Workspace</h1>
          <p className="page-subtitle">
            Welcome, <strong>{user?.name}</strong> • Host campus flagship events, manage active members, and publish timelines
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowAddEventModal(true)}>
          <Plus size={16} /> Host New Event
        </button>
      </div>

      {selectedClub && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <img
              src={selectedClub.logoUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60'}
              alt={selectedClub.name}
              style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div>
              <span className="badge badge-indigo">{selectedClub.category}</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
                {selectedClub.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Admin: {selectedClub.adminName} • {selectedClub.membersCount} Active Members
              </div>
            </div>
          </div>
        </div>
      )}

      <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={18} color="#818cf8" /> Scheduled Club Events
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {selectedClub?.events?.map((evt, idx) => (
          <div key={idx} className="card">
            <img
              src={evt.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60'}
              alt={evt.title}
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }}
            />
            <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600 }}>
              {new Date(evt.date).toDateString()}
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '0.3rem 0 0.2rem' }}>
              {evt.title}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{evt.description}</p>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={13} color="#818cf8" /> {evt.venue}
            </div>
          </div>
        ))}
      </div>

      {showAddEventModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>Host Event for {selectedClub?.name}</h2>

            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. HackCampus 2026 Registration"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Venue / Hall</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Main Auditorium"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubAdminDashboardPage;

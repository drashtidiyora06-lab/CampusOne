import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Users,
  Calendar,
  Plus,
  UserCheck,
  MapPin,
  Sparkles,
  Tag,
  ArrowRight
} from 'lucide-react';

const ClubsPage = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    imageUrl: ''
  });

  const isClubAdmin = ['club_admin', 'faculty'].includes(user?.role);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await api.get('/clubs');
      if (res.data.success) {
        setClubs(res.data.clubs);
        if (res.data.clubs.length > 0 && !selectedClub) {
          setSelectedClub(res.data.clubs[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch clubs');
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      const res = await api.post(`/clubs/${clubId}/join`);
      if (res.data.success) {
        fetchClubs();
        if (selectedClub && selectedClub._id === clubId) {
          setSelectedClub(res.data.club);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Already a member or error joining club');
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
        setSelectedClub(res.data.club);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating event');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clubs & Student Societies</h1>
          <p className="page-subtitle">
            Explore technical chapters, cultural societies, workshops, and annual campus flagship hackathons
          </p>
        </div>

        {isClubAdmin && (
          <button className="btn-primary" onClick={() => setShowAddEventModal(true)}>
            <Plus size={18} /> Host Club Event
          </button>
        )}
      </div>

      <div style={styles.mainLayout}>
        {/* Left Column: Clubs List */}
        <div style={styles.clubListStack}>
          {clubs.map((club) => {
            const isMember = club.members?.some(
              (m) => m.toString() === user?._id?.toString()
            );

            return (
              <div
                key={club._id}
                className="card"
                style={{
                  ...styles.clubCard,
                  ...(selectedClub?._id === club._id ? styles.clubCardSelected : {})
                }}
                onClick={() => setSelectedClub(club)}
              >
                <div style={styles.clubHeader}>
                  <img
                    src={
                      club.logoUrl ||
                      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60'
                    }
                    alt={club.name}
                    style={styles.logo}
                  />
                  <div>
                    <span className="badge badge-indigo">{club.category}</span>
                    <h3 style={styles.clubTitle}>{club.name}</h3>
                  </div>
                </div>

                <p style={styles.clubSnippet}>{club.description.substring(0, 90)}...</p>

                <div style={styles.clubCardFooter}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={14} /> {club.membersCount} Members
                  </div>

                  {user?.role === 'student' ? (
                    <button
                      className={isMember ? 'btn-secondary' : 'btn-primary'}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinClub(club._id);
                      }}
                    >
                      {isMember ? <UserCheck size={14} color="#34d399" /> : <Plus size={14} />}
                      {isMember ? 'Joined' : 'Join Club'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>
                      Teacher In-Charge: {club.teacherInChargeName || club.adminName}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Club Detail View */}
        {selectedClub && (
          <div className="card" style={{ flex: 1, height: 'fit-content' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <img
                src={
                  selectedClub.logoUrl ||
                  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60'
                }
                alt={selectedClub.name}
                style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover' }}
              />
              <div>
                <span className="badge badge-indigo">{selectedClub.category}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0' }}>
                  {selectedClub.name}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Lead Admin: {selectedClub.adminName} • {selectedClub.membersCount} Active Members
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {selectedClub.description}
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#818cf8" /> Upcoming Club Events
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedClub.events?.map((evt, ei) => (
                <div key={ei} style={styles.eventCard}>
                  <img
                    src={
                      evt.imageUrl ||
                      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60'
                    }
                    alt={evt.title}
                    style={styles.eventImg}
                  />
                  <div style={{ padding: '1rem', flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {new Date(evt.date).toDateString()}
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: '0.3rem 0 0.2rem' }}>
                      {evt.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
                      {evt.description}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} color="#818cf8" /> {evt.venue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Host New Event for {selectedClub?.name}
            </h2>

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
                  placeholder="Detailed schedule and guidelines..."
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

const styles = {
  mainLayout: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  clubListStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '380px'
  },
  clubCard: {
    cursor: 'pointer',
    padding: '1.15rem'
  },
  clubCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)'
  },
  clubHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginBottom: '0.65rem'
  },
  logo: {
    width: '46px',
    height: '46px',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  clubTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0.2rem 0 0'
  },
  clubSnippet: {
    fontSize: '0.82rem',
    color: '#94a3b8',
    lineHeight: 1.4,
    marginBottom: '0.85rem'
  },
  clubCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.65rem'
  },
  eventCard: {
    display: 'flex',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  eventImg: {
    width: '130px',
    objectFit: 'cover'
  }
};

export default ClubsPage;

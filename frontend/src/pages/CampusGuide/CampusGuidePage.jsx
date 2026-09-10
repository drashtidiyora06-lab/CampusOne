import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Compass,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Building,
  BookOpen,
  Coffee,
  Cpu
} from 'lucide-react';

const CampusGuidePage = () => {
  const [locations, setLocations] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchLocations();
  }, [categoryFilter]);

  const fetchLocations = async () => {
    try {
      const res = await api.get(`/campus-guide?category=${categoryFilter}`);
      if (res.data.success) {
        setLocations(res.data.locations);
      }
    } catch (err) {
      console.warn('Failed to fetch campus locations');
    }
  };

  const categories = [
    { key: 'all', label: 'All Places', icon: Building },
    { key: 'library', label: 'Libraries', icon: BookOpen },
    { key: 'lab', label: 'Tech Labs', icon: Cpu },
    { key: 'canteen', label: 'Food & Cafes', icon: Coffee },
    { key: 'admin', label: 'Admin Offices', icon: Building }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus Guide & Directory</h1>
          <p className="page-subtitle">
            Essential campus facilities, laboratory timings, administrative office contacts, and dining halls
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div style={styles.pillBar}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              style={{
                ...styles.pillBtn,
                ...(categoryFilter === cat.key ? styles.pillBtnActive : {})
              }}
              onClick={() => setCategoryFilter(cat.key)}
            >
              <Icon size={16} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Locations Grid */}
      <div style={styles.grid}>
        {locations.map((loc) => (
          <div key={loc._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={styles.imgContainer}>
              <img
                src={
                  loc.imageUrl ||
                  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60'
                }
                alt={loc.name}
                style={styles.cardImg}
              />
              <span className={`badge ${loc.isOpen ? 'badge-green' : 'badge-red'}`} style={styles.statusOverlay}>
                {loc.isOpen ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {loc.isOpen ? 'OPEN NOW' : 'CLOSED'}
              </span>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
                {loc.category}
              </span>
              <h3 style={styles.locName}>{loc.name}</h3>
              <p style={styles.locDesc}>{loc.description}</p>

              <div style={styles.infoList}>
                <div style={styles.infoRow}>
                  <MapPin size={15} color="#818cf8" />
                  <span>{loc.location}</span>
                </div>
                <div style={styles.infoRow}>
                  <Clock size={15} color="#60a5fa" />
                  <span>{loc.timings}</span>
                </div>
                {loc.contact && (
                  <div style={styles.infoRow}>
                    <Phone size={15} color="#34d399" />
                    <span>{loc.contact}</span>
                  </div>
                )}
              </div>

              {loc.features && loc.features.length > 0 && (
                <div style={styles.featureTags}>
                  {loc.features.map((f, fi) => (
                    <span key={fi} style={styles.featureTag}>
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pillBar: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.75rem',
    flexWrap: 'wrap'
  },
  pillBtn: {
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
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  pillBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    color: '#ffffff'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  imgContainer: {
    position: 'relative',
    height: '180px',
    width: '100%',
    overflow: 'hidden'
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  statusOverlay: {
    position: 'absolute',
    top: '12px',
    right: '12px'
  },
  locName: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0.4rem 0 0.5rem'
  },
  locDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.4,
    marginBottom: '1rem'
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    fontSize: '0.82rem',
    color: '#cbd5e1',
    marginBottom: '1rem'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  featureTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '0.75rem'
  },
  featureTag: {
    fontSize: '0.72rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: '#94a3b8',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  }
};

export default CampusGuidePage;

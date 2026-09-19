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
    { key: 'all', label: 'All Campus Facilities', icon: Building },
    { key: 'academic', label: 'Academic Blocks', icon: BookOpen },
    { key: 'library', label: 'Libraries', icon: BookOpen },
    { key: 'lab', label: 'Laboratories', icon: Cpu },
    { key: 'canteen', label: 'Canteen & Food', icon: Coffee },
    { key: 'admin', label: 'Administration Offices', icon: Building },
    { key: 'sports', label: 'Sports & Gym', icon: Compass },
    { key: 'hostel', label: 'Hostels', icon: Building },
    { key: 'services', label: 'Student Services', icon: Compass }
  ];

  const getFallbackImageForLocation = (loc) => {
    if (loc.imageUrl && !loc.imageUrl.includes('photo-1521587760476-6c12a4b040da')) {
      return loc.imageUrl;
    }
    const nameLower = (loc.name || '').toLowerCase();
    const catLower = (loc.category || '').toLowerCase();

    if (nameLower.includes('computer') || nameLower.includes('it lab')) {
      return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('science') || nameLower.includes('electronics') || nameLower.includes('chemistry') || nameLower.includes('physics')) {
      return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('auditorium') || nameLower.includes('theater')) {
      return 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('canteen') || nameLower.includes('cafeteria') || catLower === 'canteen') {
      return 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('library') || catLower === 'library') {
      return 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('sports') || nameLower.includes('gym') || catLower === 'sports') {
      return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('hostel') || catLower === 'hostel') {
      return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('medical') || nameLower.includes('health') || catLower === 'medical') {
      return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('parking') || catLower === 'parking') {
      return 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('help desk') || nameLower.includes('services') || catLower === 'services') {
      return 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('placement') || nameLower.includes('career')) {
      return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('exam') || nameLower.includes('test')) {
      return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80';
    }
    if (nameLower.includes('academic') || catLower === 'academic') {
      return 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80';
    }
    if (catLower === 'lab') {
      return 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80';
    }
    if (catLower === 'admin') {
      return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80';
    }

    return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus Guide & Directory</h1>
          <p className="page-subtitle">
            Essential campus facilities, academic blocks, laboratory timings, administrative office contacts, and dining halls
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
                src={getFallbackImageForLocation(loc)}
                alt={loc.name}
                style={styles.cardImg}
              />
              <span className={`badge ${loc.isOpen ? 'badge-green' : 'badge-red'}`} style={styles.statusOverlay}>
                {loc.isOpen ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {loc.isOpen ? 'OPEN NOW' : 'CLOSED'}
              </span>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-indigo">
                  {loc.category?.toUpperCase()}
                </span>
                {(loc.building || loc.roomNumber) && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                    {loc.building || ''} {loc.floor ? `• ${loc.floor}` : ''} {loc.roomNumber ? `(Room ${loc.roomNumber})` : ''}
                  </span>
                )}
              </div>
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

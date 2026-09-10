import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nRes, aRes, dRes] = await Promise.all([
        api.get('/notices'),
        api.get('/academics/assignments'),
        api.get('/placements/drives')
      ]);
      if (nRes.data.success) setNotices(nRes.data.notices.slice(0, 3));
      if (aRes.data.success) setAssignments(aRes.data.assignments.slice(0, 2));
      if (dRes.data.success) setDrives(dRes.data.drives.slice(0, 2));
    } catch (err) {
      console.warn('Mobile API fetch fallback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={14} color="#818cf8" />
          <Text style={styles.badgeText}>CampusOne Mobile Hub</Text>
        </View>
        <Text style={styles.greeting}>Welcome, {user?.name}!</Text>
        <Text style={styles.subText}>{user?.branch} • {user?.year}</Text>
      </View>

      {/* Notices Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notices')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {notices.map((notice) => (
        <View key={notice._id} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.tag}>{notice.category.toUpperCase()}</Text>
            <Text style={styles.date}>{new Date(notice.createdAt).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.cardTitle}>{notice.title}</Text>
          <Text style={styles.cardBody} numberOfLines={2}>{notice.content}</Text>
        </View>
      ))}

      {/* Deadlines Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Assignments</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Academics')}>
          <Text style={styles.seeAll}>View Tasks</Text>
        </TouchableOpacity>
      </View>

      {assignments.map((asg) => (
        <View key={asg._id} style={styles.card}>
          <Text style={styles.cardSubject}>{asg.subject}</Text>
          <Text style={styles.cardTitle}>{asg.title}</Text>
          <Text style={styles.dueDate}>Due: {new Date(asg.dueDate).toLocaleDateString()}</Text>
        </View>
      ))}

      {/* Placements Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Recruitment Drives</Text>
        <TouchableOpacity onPress={() => navigation.navigate('More')}>
          <Text style={styles.seeAll}>Placements</Text>
        </TouchableOpacity>
      </View>

      {drives.map((d) => (
        <View key={d._id} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>{d.companyName}</Text>
            <Text style={styles.ctcBadge}>{d.ctc}</Text>
          </View>
          <Text style={styles.cardBody}>{d.role}</Text>
          <Text style={styles.date}>Drive Date: {new Date(d.driveDate).toLocaleDateString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16 },
  banner: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)'
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  badgeText: { color: '#818cf8', fontWeight: '700', fontSize: 12 },
  greeting: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  subText: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  sectionTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  seeAll: { color: '#818cf8', fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { color: '#818cf8', fontWeight: '700', fontSize: 11 },
  date: { color: '#64748b', fontSize: 11 },
  cardTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginTop: 4 },
  cardBody: { color: '#94a3b8', fontSize: 13, marginTop: 4, lineHeight: 18 },
  cardSubject: { color: '#34d399', fontSize: 12, fontWeight: '600' },
  dueDate: { color: '#fbbf24', fontSize: 12, marginTop: 6, fontWeight: '600' },
  ctcBadge: { color: '#34d399', fontWeight: '700', fontSize: 13 }
});

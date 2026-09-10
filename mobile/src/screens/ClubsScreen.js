import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function ClubsScreen() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await api.get('/clubs');
      if (res.data.success) {
        setClubs(res.data.clubs);
      }
    } catch (err) {
      console.warn('Failed to fetch clubs');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.category}>{item.category.toUpperCase()}</Text>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.members}>{item.membersCount} Active Members</Text>

            {item.events?.length > 0 && (
              <View style={styles.eventBox}>
                <Text style={styles.eventHeading}>Upcoming Event:</Text>
                <Text style={styles.eventTitle}>{item.events[0].title}</Text>
                <Text style={styles.eventVenue}>{new Date(item.events[0].date).toDateString()} • {item.events[0].venue}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.joinBtn}>
              <Ionicons name="person-add-outline" size={14} color="#ffffff" />
              <Text style={styles.btnText}>Join Club</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  category: { color: '#818cf8', fontWeight: '700', fontSize: 11 },
  title: { color: '#ffffff', fontSize: 17, fontWeight: '800', marginTop: 2 },
  desc: { color: '#94a3b8', fontSize: 13, marginTop: 4, lineHeight: 18 },
  members: { color: '#64748b', fontSize: 11, marginTop: 8 },
  eventBox: { backgroundColor: '#0f172a', borderRadius: 8, padding: 10, marginTop: 10 },
  eventHeading: { color: '#fbbf24', fontSize: 11, fontWeight: '700' },
  eventTitle: { color: '#ffffff', fontSize: 13, fontWeight: '700', marginTop: 2 },
  eventVenue: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  joinBtn: { backgroundColor: '#6366f1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, marginTop: 12 },
  btnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' }
});

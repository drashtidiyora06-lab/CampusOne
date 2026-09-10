import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import api from '../services/api';

export default function CampusGuideScreen() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await api.get('/campus-guide');
      if (res.data.success) {
        setLocations(res.data.locations);
      }
    } catch (err) {
      console.warn('Campus guide fetch error');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.category}>{item.category.toUpperCase()}</Text>
              <Text style={[styles.status, item.isOpen ? styles.open : styles.closed]}>
                {item.isOpen ? 'OPEN NOW' : 'CLOSED'}
              </Text>
            </View>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.info}>Location: {item.location}</Text>
            <Text style={styles.info}>Timings: {item.timings}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  category: { color: '#818cf8', fontWeight: '700', fontSize: 11 },
  status: { fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  open: { backgroundColor: 'rgba(52, 211, 153, 0.2)', color: '#34d399' },
  closed: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  desc: { color: '#94a3b8', fontSize: 13, marginTop: 4, lineHeight: 18 },
  info: { color: '#cbd5e1', fontSize: 12, marginTop: 6 }
});

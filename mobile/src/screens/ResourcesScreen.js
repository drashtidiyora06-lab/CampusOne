import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function ResourcesScreen() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      if (res.data.success) {
        setResources(res.data.resources);
      }
    } catch (err) {
      console.warn('Failed to fetch resources');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={resources}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.semester}>{item.semester}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subject}>{item.subject}</Text>

            <View style={styles.footer}>
              <Text style={styles.downloads}>{item.downloadsCount} Downloads</Text>
              <TouchableOpacity style={styles.downloadBtn}>
                <Ionicons name="download-outline" size={14} color="#ffffff" />
                <Text style={styles.btnText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
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
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  category: { color: '#818cf8', fontWeight: '700', fontSize: 11 },
  semester: { color: '#94a3b8', fontSize: 11 },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  subject: { color: '#60a5fa', fontSize: 13, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  downloads: { color: '#34d399', fontSize: 12, fontWeight: '600' },
  downloadBtn: { backgroundColor: '#6366f1', flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnText: { color: '#ffffff', fontSize: 12, fontWeight: '600' }
});

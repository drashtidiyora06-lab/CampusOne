import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function NoticesScreen() {
  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchNotices();
  }, [category]);

  const fetchNotices = async () => {
    try {
      const res = await api.get(`/notices?category=${category}`);
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      console.warn('Failed to fetch notices');
    }
  };

  return (
    <View style={styles.container}>
      {/* Category Pills */}
      <View style={styles.categories}>
        {['all', 'academic', 'placement', 'club', 'general'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, category === cat && styles.pillActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={notices}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.card, item.isImportant && styles.importantCard]}>
            {item.isImportant && (
              <View style={styles.importantBadge}>
                <Ionicons name="warning" size={12} color="#ffffff" />
                <Text style={styles.importantText}>IMPORTANT</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.tag}>{item.category.toUpperCase()}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.author}>Posted by: {item.authorName} ({item.authorRole})</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  categories: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  pill: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  pillActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  pillText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  pillTextActive: { color: '#ffffff' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  importantCard: { borderColor: 'rgba(239, 68, 68, 0.5)' },
  importantBadge: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8
  },
  importantText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  tag: { color: '#818cf8', fontWeight: '700', fontSize: 11 },
  date: { color: '#64748b', fontSize: 11 },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  content: { color: '#cbd5e1', fontSize: 13, marginTop: 6, lineHeight: 18 },
  author: { color: '#64748b', fontSize: 11, marginTop: 10 }
});

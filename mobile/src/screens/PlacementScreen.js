import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import api from '../services/api';

export default function PlacementScreen() {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/placements/drives');
      if (res.data.success) {
        setDrives(res.data.drives);
      }
    } catch (err) {
      console.warn('Placement fetch error');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={drives}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title}>{item.companyName}</Text>
              <Text style={styles.ctc}>{item.ctc}</Text>
            </View>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.meta}>Min CGPA Cutoff: {item.minCgpa}</Text>
            <Text style={styles.meta}>Drive Date: {new Date(item.driveDate).toLocaleDateString()}</Text>

            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.btnText}>Apply for Drive</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  ctc: { color: '#34d399', fontSize: 14, fontWeight: '800' },
  role: { color: '#818cf8', fontSize: 14, fontWeight: '600', marginTop: 2 },
  desc: { color: '#94a3b8', fontSize: 13, marginTop: 6, lineHeight: 18 },
  meta: { color: '#cbd5e1', fontSize: 12, marginTop: 4 },
  applyBtn: { backgroundColor: '#6366f1', alignItems: 'center', paddingVertical: 8, borderRadius: 8, marginTop: 12 },
  btnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' }
});

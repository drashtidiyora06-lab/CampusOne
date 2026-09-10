import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import api from '../services/api';

export default function ServicesScreen() {
  const [requests, setRequests] = useState([]);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('bonafide');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/services');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.warn('Services fetch error');
    }
  };

  const handleCreate = async () => {
    if (!subject || !details) return;
    try {
      const res = await api.post('/services', { requestType: type, subject, details });
      if (res.data.success) {
        setSubject('');
        setDetails('');
        fetchRequests();
      }
    } catch (err) {
      alert('Error submitting request');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Submit New Request</Text>
        <TextInput
          style={styles.input}
          placeholder="Subject (e.g. ID Card Reissue)"
          placeholderTextColor="#64748b"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Details..."
          placeholderTextColor="#64748b"
          multiline
          value={details}
          onChangeText={setDetails}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
          <Text style={styles.btnText}>Submit Request</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.type}>{item.requestType.toUpperCase()}</Text>
              <Text style={[styles.status, item.status === 'approved' ? styles.appr : item.status === 'rejected' ? styles.rej : styles.pend]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.title}>{item.subject}</Text>
            <Text style={styles.desc}>{item.details}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  formCard: { backgroundColor: '#1e293b', padding: 16, margin: 16, borderRadius: 12 },
  formTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  input: { backgroundColor: '#0f172a', color: '#ffffff', padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 13 },
  submitBtn: { backgroundColor: '#6366f1', alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  type: { color: '#818cf8', fontWeight: '700', fontSize: 11 },
  status: { fontSize: 10, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  appr: { backgroundColor: 'rgba(52,211,153,0.2)', color: '#34d399' },
  rej: { backgroundColor: 'rgba(239,68,68,0.2)', color: '#f87171' },
  pend: { backgroundColor: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
  title: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  desc: { color: '#94a3b8', fontSize: 13, marginTop: 4 }
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function AcademicsScreen() {
  const [activeTab, setActiveTab] = useState('timetable');
  const [timetable, setTimetable] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const [ttRes, asgRes, resRes] = await Promise.all([
        api.get('/academics/timetable'),
        api.get('/academics/assignments'),
        api.get('/academics/results')
      ]);
      if (ttRes.data.success) setTimetable(ttRes.data.timetable);
      if (asgRes.data.success) setAssignments(asgRes.data.assignments);
      if (resRes.data.success) setResults(resRes.data.results[0] || null);
    } catch (err) {
      console.warn('Academic fetch error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'timetable' && styles.tabActive]}
          onPress={() => setActiveTab('timetable')}
        >
          <Text style={[styles.tabText, activeTab === 'timetable' && styles.tabTextActive]}>
            Timetable
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'assignments' && styles.tabActive]}
          onPress={() => setActiveTab('assignments')}
        >
          <Text style={[styles.tabText, activeTab === 'assignments' && styles.tabTextActive]}>
            Assignments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'results' && styles.tabActive]}
          onPress={() => setActiveTab('results')}
        >
          <Text style={[styles.tabText, activeTab === 'results' && styles.tabTextActive]}>
            Results
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {activeTab === 'timetable' &&
          timetable?.schedule?.map((day) => (
            <View key={day.day} style={styles.dayCard}>
              <Text style={styles.dayTitle}>{day.day}</Text>
              {day.slots.map((slot, i) => (
                <View key={i} style={styles.slotRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.slotSubject}>{slot.subject}</Text>
                    <Text style={styles.slotTime}>{slot.time} • Room {slot.room}</Text>
                  </View>
                  <Text style={styles.slotInstructor}>{slot.instructor}</Text>
                </View>
              ))}
            </View>
          ))}

        {activeTab === 'assignments' &&
          assignments.map((asg) => (
            <View key={asg._id} style={styles.card}>
              <Text style={styles.asgSubject}>{asg.subject}</Text>
              <Text style={styles.asgTitle}>{asg.title}</Text>
              <Text style={styles.asgDesc}>{asg.description}</Text>
              <Text style={styles.asgDue}>Due Date: {new Date(asg.dueDate).toLocaleDateString()}</Text>
            </View>
          ))}

        {activeTab === 'results' && (
          <View style={styles.card}>
            <Text style={styles.gpaTitle}>Semester Gradecard ({results?.semester || 'Sem 5'})</Text>
            <View style={styles.gpaRow}>
              <View>
                <Text style={styles.gpaLabel}>CGPA</Text>
                <Text style={styles.gpaVal}>{results?.cgpa || '8.85'}</Text>
              </View>
              <View>
                <Text style={styles.gpaLabel}>SGPA</Text>
                <Text style={styles.sgpaVal}>{results?.sgpa || '9.10'}</Text>
              </View>
            </View>

            {results?.subjects?.map((sub, i) => (
              <View key={i} style={styles.subRow}>
                <Text style={styles.subName}>{sub.name}</Text>
                <Text style={styles.subGrade}>{sub.grade}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#1e293b' },
  tabActive: { backgroundColor: '#6366f1' },
  tabText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#ffffff' },
  dayCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12 },
  dayTitle: { color: '#818cf8', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  slotRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  slotSubject: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  slotTime: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  slotInstructor: { color: '#60a5fa', fontSize: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12 },
  asgSubject: { color: '#34d399', fontSize: 12, fontWeight: '700' },
  asgTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginTop: 4 },
  asgDesc: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  asgDue: { color: '#fbbf24', fontSize: 12, marginTop: 8, fontWeight: '600' },
  gpaTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  gpaRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#0f172a', padding: 12, borderRadius: 8, marginBottom: 14 },
  gpaLabel: { color: '#94a3b8', fontSize: 11 },
  gpaVal: { color: '#34d399', fontSize: 22, fontWeight: '800' },
  sgpaVal: { color: '#60a5fa', fontSize: 22, fontWeight: '800' },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  subName: { color: '#cbd5e1', fontSize: 13 },
  subGrade: { color: '#34d399', fontSize: 13, fontWeight: '800' }
});

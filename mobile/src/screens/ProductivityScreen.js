import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import api from '../services/api';

export default function ProductivityScreen() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [timerSecs, setTimerSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let timer = null;
    if (running && timerSecs > 0) {
      timer = setInterval(() => setTimerSecs((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running, timerSecs]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/productivity/tasks');
      if (res.data.success) setTasks(res.data.tasks);
    } catch (err) {
      console.warn('Tasks fetch error');
    }
  };

  const addTask = async () => {
    if (!title) return;
    try {
      const res = await api.post('/productivity/tasks', { title });
      if (res.data.success) {
        setTitle('');
        fetchTasks();
      }
    } catch (err) {
      alert('Error creating task');
    }
  };

  const toggleTask = async (id) => {
    try {
      await api.put(`/productivity/tasks/${id}/toggle`);
      fetchTasks();
    } catch (err) {}
  };

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Focus Timer */}
      <View style={styles.timerCard}>
        <Text style={styles.timerTitle}>Study Pomodoro Timer</Text>
        <Text style={styles.timerDisplay}>{formatTimer(timerSecs)}</Text>
        <TouchableOpacity style={styles.timerBtn} onPress={() => setRunning(!running)}>
          <Text style={styles.btnText}>{running ? 'Pause Focus' : 'Start Focus Session'}</Text>
        </TouchableOpacity>
      </View>

      {/* Task Manager */}
      <View style={styles.taskForm}>
        <TextInput
          style={styles.input}
          placeholder="New Task..."
          placeholderTextColor="#64748b"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskRow} onPress={() => toggleTask(item._id)}>
            <Text style={[styles.taskText, item.completed && styles.completed]}>
              {item.completed ? '✓ ' : '○ '} {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  timerCard: { backgroundColor: '#1e293b', padding: 18, margin: 16, borderRadius: 12, alignItems: 'center' },
  timerTitle: { color: '#818cf8', fontWeight: '700', fontSize: 13 },
  timerDisplay: { color: '#ffffff', fontSize: 36, fontWeight: '800', marginVertical: 8 },
  timerBtn: { backgroundColor: '#6366f1', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  btnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  taskForm: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#1e293b', color: '#ffffff', padding: 10, borderRadius: 8, fontSize: 13 },
  addBtn: { backgroundColor: '#6366f1', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8 },
  taskRow: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8, marginBottom: 8 },
  taskText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  completed: { color: '#64748b', textDecorationLine: 'line-through' }
});

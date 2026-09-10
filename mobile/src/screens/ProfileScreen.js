import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, switchRole } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri:
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>ROLE: {user?.role?.toUpperCase()}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Roll Number: {user?.rollNumber}</Text>
          <Text style={styles.infoText}>Branch: {user?.branch}</Text>
          <Text style={styles.infoText}>Year: {user?.year}</Text>
        </View>

        <Text style={styles.roleTitle}>Test Role Permissions:</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity style={styles.btn} onPress={() => switchRole('student')}>
            <Text style={styles.btnText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => switchRole('club_admin')}>
            <Text style={styles.btnText}>Club Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => switchRole('placement_admin')}>
            <Text style={styles.btnText}>Placement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#6366f1' },
  name: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginTop: 10 },
  email: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  roleBadge: { backgroundColor: 'rgba(99, 102, 241, 0.2)', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, marginTop: 8 },
  roleText: { color: '#818cf8', fontWeight: '700', fontSize: 11 },
  infoBox: { backgroundColor: '#0f172a', width: '100%', borderRadius: 10, padding: 12, marginTop: 16, gap: 4 },
  infoText: { color: '#cbd5e1', fontSize: 13 },
  roleTitle: { color: '#64748b', fontSize: 11, fontWeight: '700', marginTop: 16, alignSelf: 'flex-start' },
  roleButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { backgroundColor: '#0f172a', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  btnText: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' }
});

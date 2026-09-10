import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen({ navigation }) {
  const menuItems = [
    { title: 'Campus Directory Guide', subtitle: 'Timings, labs, library & office contacts', icon: 'compass', route: 'CampusGuide' },
    { title: 'Placement Drives & CTC', subtitle: 'Company recruitment drives & interview guides', icon: 'briefcase', route: 'Placements' },
    { title: 'Student Administrative Services', subtitle: 'ID card, bonafide letters, hostel complaints', icon: 'file-tray-full', route: 'Services' },
    { title: 'Productivity & Study Timer', subtitle: 'Focus Pomodoro counter & to-do checklist', icon: 'checkbox', route: 'Productivity' },
    { title: 'My Student Profile', subtitle: 'Roll number, branch, academic info & role', icon: 'person', route: 'Profile' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>More Campus Services</Text>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuCard}
          onPress={() => navigation.navigate(item.route)}
        >
          <View style={styles.iconBox}>
            <Ionicons name={item.icon} size={22} color="#818cf8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748b" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  subtitle: { color: '#94a3b8', fontSize: 12, marginTop: 2 }
});

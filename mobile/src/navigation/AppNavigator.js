import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import NoticesScreen from '../screens/NoticesScreen';
import AcademicsScreen from '../screens/AcademicsScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ClubsScreen from '../screens/ClubsScreen';
import MoreScreen from '../screens/MoreScreen';
import CampusGuideScreen from '../screens/CampusGuideScreen';
import PlacementScreen from '../screens/PlacementScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProductivityScreen from '../screens/ProductivityScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' }
      }}
    >
      <Stack.Screen name="MoreMenu" component={MoreScreen} options={{ title: 'Campus Features' }} />
      <Stack.Screen name="CampusGuide" component={CampusGuideScreen} options={{ title: 'Campus Directory' }} />
      <Stack.Screen name="Placements" component={PlacementScreen} options={{ title: 'Placement Drives' }} />
      <Stack.Screen name="Services" component={ServicesScreen} options={{ title: 'Student Services' }} />
      <Stack.Screen name="Productivity" component={ProductivityScreen} options={{ title: 'Focus & Tasks' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'User Profile' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4
        },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#64748b',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'square';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Notices') iconName = 'notifications';
          else if (route.name === 'Academics') iconName = 'book';
          else if (route.name === 'Resources') iconName = 'folder-open';
          else if (route.name === 'Clubs') iconName = 'people';
          else if (route.name === 'More') iconName = 'grid';

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Notices" component={NoticesScreen} options={{ title: 'Notices' }} />
      <Tab.Screen name="Academics" component={AcademicsScreen} options={{ title: 'Academics' }} />
      <Tab.Screen name="Resources" component={ResourcesScreen} options={{ title: 'Resources' }} />
      <Tab.Screen name="Clubs" component={ClubsScreen} options={{ title: 'Clubs' }} />
      <Tab.Screen name="More" component={MoreStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

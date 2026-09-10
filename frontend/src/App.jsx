import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Shell/Layout';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NoticesPage from './pages/Notices/NoticesPage';
import AcademicsPage from './pages/Academics/AcademicsPage';
import ResourcesPage from './pages/Resources/ResourcesPage';
import CampusGuidePage from './pages/CampusGuide/CampusGuidePage';
import ClubsPage from './pages/Clubs/ClubsPage';
import PlacementPage from './pages/Placement/PlacementPage';
import ServicesPage from './pages/Services/ServicesPage';
import ProductivityPage from './pages/Productivity/ProductivityPage';
import ProfilePage from './pages/Profile/ProfilePage';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#818cf8', fontWeight: 600 }}>
        Loading CampusOne Platform...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />
      <Route
        path="/notices"
        element={
          <Layout>
            <NoticesPage />
          </Layout>
        }
      />
      <Route
        path="/academics"
        element={
          <Layout>
            <AcademicsPage />
          </Layout>
        }
      />
      <Route
        path="/resources"
        element={
          <Layout>
            <ResourcesPage />
          </Layout>
        }
      />
      <Route
        path="/campus-guide"
        element={
          <Layout>
            <CampusGuidePage />
          </Layout>
        }
      />
      <Route
        path="/clubs"
        element={
          <Layout>
            <ClubsPage />
          </Layout>
        }
      />
      <Route
        path="/placements"
        element={
          <Layout>
            <PlacementPage />
          </Layout>
        }
      />
      <Route
        path="/services"
        element={
          <Layout>
            <ServicesPage />
          </Layout>
        }
      />
      <Route
        path="/productivity"
        element={
          <Layout>
            <ProductivityPage />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

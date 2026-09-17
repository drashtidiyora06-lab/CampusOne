import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Shell/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import UnauthorizedPage from './pages/Common/UnauthorizedPage';

// Role Dashboards
import StudentDashboardPage from './pages/Student/StudentDashboardPage';
import TeacherDashboardPage from './pages/Teacher/TeacherDashboardPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import ClubAdminDashboardPage from './pages/ClubAdmin/ClubAdminDashboardPage';
import PlacementAdminDashboardPage from './pages/PlacementAdmin/PlacementAdminDashboardPage';

// Shared Pages
import NoticesPage from './pages/Notices/NoticesPage';
import AcademicsPage from './pages/Academics/AcademicsPage';
import ResourcesPage from './pages/Resources/ResourcesPage';
import CampusGuidePage from './pages/CampusGuide/CampusGuidePage';
import ClubsPage from './pages/Clubs/ClubsPage';
import PlacementPage from './pages/Placement/PlacementPage';
import ServicesPage from './pages/Services/ServicesPage';
import ProductivityPage from './pages/Productivity/ProductivityPage';
import ProfilePage from './pages/Profile/ProfilePage';

// CampusOne V3 Pages
import TeacherMarksEntryPage from './pages/Teacher/TeacherMarksEntryPage';
import StudentResultsPage from './pages/Student/StudentResultsPage';
import AdminAcademicManagementPage from './pages/Admin/AdminAcademicManagementPage';


function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'faculty':
    case 'teacher':
      return <Navigate to="/teacher/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'club_admin':
      return <Navigate to="/club-admin/dashboard" replace />;
    case 'placement_admin':
      return <Navigate to="/placement-admin/dashboard" replace />;
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
}

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
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Root Role Redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Student Portal Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student', 'faculty', 'admin', 'club_admin', 'placement_admin']}>
            <Layout>
              <StudentDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Teacher Portal Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <Layout>
              <TeacherDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/marks"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <Layout>
              <TeacherMarksEntryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/submissions"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <Layout>
              <TeacherDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Portal Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminAcademicManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student Results Route */}
      <Route
        path="/student/results"
        element={
          <ProtectedRoute>
            <Layout>
              <StudentResultsPage />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* Club Admin Routes */}
      <Route
        path="/club-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['club_admin', 'admin']}>
            <Layout>
              <ClubAdminDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Placement Admin Routes */}
      <Route
        path="/placement-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['placement_admin', 'admin']}>
            <Layout>
              <PlacementAdminDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Shared Module Pages */}
      <Route
        path="/notices"
        element={
          <ProtectedRoute>
            <Layout>
              <NoticesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/academics"
        element={
          <ProtectedRoute>
            <Layout>
              <AcademicsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Layout>
              <ResourcesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/campus-guide"
        element={
          <ProtectedRoute>
            <Layout>
              <CampusGuidePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs"
        element={
          <ProtectedRoute>
            <Layout>
              <ClubsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/placements"
        element={
          <ProtectedRoute>
            <Layout>
              <PlacementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Layout>
              <ServicesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/productivity"
        element={
          <ProtectedRoute>
            <Layout>
              <ProductivityPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
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

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import SearchPageSimple from './pages/SearchPageSimple';
import SupplierDetailPage from './components/pages/SupplierDetailPage';
import ProfilePage from './pages/ProfilePage';
import PAWSPage from './pages/PAWSPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthTest from './test/AuthTest';
import DebugPage from './test/DebugPage';
import OAuthTesting from './test/OAuthTesting';

// OAuth Callback Pages
import GoogleCallback from './pages/auth/GoogleCallback';
import FacebookCallback from './pages/auth/FacebookCallback';
import AppleCallback from './pages/auth/AppleCallback';

// Layout
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

const AppRouter = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route 
            path="login" 
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/">
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="register" 
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/">
                <RegisterPage />
              </ProtectedRoute>
            } 
          />
          {/* OAuth Callback Routes */}
          <Route path="google/callback" element={<GoogleCallback />} />
          <Route path="facebook/callback" element={<FacebookCallback />} />
          <Route path="apple/callback" element={<AppleCallback />} />
          
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Protected Application Routes */}
        <Route path="/" element={<MainLayout />}>
          {/* Public routes within main layout */}
          <Route index element={<SearchPageSimple />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="supplier/:id" element={<SupplierDetailPage />} />
          <Route path="auth-test" element={<AuthTest />} />
          <Route path="oauth-test" element={<OAuthTesting />} />
          
          {/* Protected routes */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="paws" 
            element={
              <ProtectedRoute>
                <PAWSPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Legacy route redirects */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
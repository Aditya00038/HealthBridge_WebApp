import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import PWABadge from './PWABadge.jsx';

// Pages
import LandingPage from '@/pages/LandingPageClean';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import PatientDashboard from '@/pages/patient/PatientDashboard';
import PatientAppointments from '@/pages/patient/PatientAppointmentsEnhanced';
import PatientProfile from '@/pages/patient/PatientProfile';
import LocatePage from '@/pages/patient/LocatePage';
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import DoctorAppointments from '@/pages/doctor/DoctorAppointments';
import DoctorPatients from '@/pages/doctor/DoctorPatients';
import DoctorProfileSetup from '@/pages/DoctorProfileSetup';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AppointmentBooking from '@/pages/AppointmentBooking';
import VideoCall from '@/pages/VideoCall';
import Chatbot from '@/pages/Chatbot';
import ChatbotFullScreen from '@/pages/ChatbotFullScreen';
import ChatbotNew from '@/pages/ChatbotNew';
import PricingPage from '@/pages/PricingPageClean';
import ProfileSettings from '@/pages/ProfileSettings';
import UserProfile from '@/pages/UserProfile';

// Components
import Navbar from '@/components/layout/NavbarClean';
import Footer from '@/components/layout/FooterClean';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading, userProfile } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (user) {
    // Redirect based on user role
    const userRole = user.role || 'patient';
    switch (userRole) {
      case 'patient':
        return <Navigate to="/patient/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Redirect based on user role
  const userRole = userProfile?.role || user?.role || 'patient';
  switch (userRole) {
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />;
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/patient/dashboard" replace />;
  }
};

// Layout wrapper component
const LayoutWrapper = ({ children, fullScreen = false }) => {
  if (fullScreen) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PaymentProvider>
          <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <Routes>
              {/* Full-screen routes (no navbar/footer) */}
              <Route 
                path="/chatbot-fullscreen" 
                element={
                  <ProtectedRoute>
                    <ChatbotFullScreen />
                  </ProtectedRoute>
                } 
              />

              {/* Regular routes with layout */}
              <Route
                path="/*"
                element={
                  <LayoutWrapper>
                    <Routes>
                      {/* Dashboard Route - redirects to appropriate dashboard based on user role */}
                      <Route path="/" element={<DashboardRedirect />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute>
                      <SignupPage />
                    </PublicRoute>
                  } 
                />

                {/* Protected Routes */}
                <Route 
                  path="/patient/dashboard" 
                  element={
                    <ProtectedRoute>
                      <PatientDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/profile-setup" 
                  element={
                    <ProtectedRoute>
                      <DoctorProfileSetup />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/patient/appointments" 
                  element={
                    <ProtectedRoute>
                      <PatientAppointments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/patient/profile" 
                  element={
                    <ProtectedRoute>
                      <PatientProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/locate" 
                  element={
                    <ProtectedRoute>
                      <LocatePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/appointments" 
                  element={
                    <ProtectedRoute>
                      <DoctorAppointments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/patients" 
                  element={
                    <ProtectedRoute>
                      <DoctorPatients />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/appointment/book" 
                  element={
                    <ProtectedRoute>
                      <AppointmentBooking />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/video-call/:appointmentId?" 
                  element={
                    <ProtectedRoute>
                      <VideoCall />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chatbot" 
                  element={
                    <ProtectedRoute>
                      <ChatbotNew />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile/settings" 
                  element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile/:userId" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </LayoutWrapper>
                }
              />
            </Routes>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          
          {/* PWA Badge */}
          <PWABadge />
        </Router>
        </PaymentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App

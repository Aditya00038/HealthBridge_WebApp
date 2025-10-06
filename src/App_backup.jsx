import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import PatientDashboard from '@/pages/patient/PatientDashboard';
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AppointmentBook from '@/pages/patient/AppointmentBook';
import VideoCall from '@/pages/patient/VideoCall';
import ChatBot from '@/pages/patient/ChatBot';
import MedicineShop from '@/pages/patient/MedicineShop';
import PricingPage from '@/pages/PricingPage';

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (user) {
    switch (user.role) {
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

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/signup" element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                } />
                
                {/* Patient Routes */}
                <Route path="/patient/dashboard" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/patient/book-appointment" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <AppointmentBook />
                  </ProtectedRoute>
                } />
                <Route path="/patient/video-call/:appointmentId" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <VideoCall />
                  </ProtectedRoute>
                } />
                <Route path="/patient/chatbot" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <ChatBot />
                  </ProtectedRoute>
                } />
                <Route path="/patient/medicine-shop" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <MedicineShop />
                  </ProtectedRoute>
                } />
                
                {/* Doctor Routes */}
                <Route path="/doctor/dashboard" element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#dc2626',
                  },
                },
              }}
            />
          </div>
        </Router>
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;

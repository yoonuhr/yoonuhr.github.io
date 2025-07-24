import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import AuthErrorBoundary from './components/common/AuthErrorBoundary';
import RideErrorBoundary from './components/common/RideErrorBoundary';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RideRequestPage from './pages/RideRequestPage';
import NotFoundPage from './pages/NotFoundPage';
import RidesPage from './pages/RidesPage';

// Protected Pages
import ProfilePage from './pages/ProfilePage';
import TestDataPage from './pages/TestDataPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              
              {/* Auth Routes - redirect authenticated users */}
              <Route 
                path="/login" 
                element={
                  <AuthErrorBoundary>
                    <ProtectedRoute requireAuth={false}>
                      <LoginPage />
                    </ProtectedRoute>
                  </AuthErrorBoundary>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <AuthErrorBoundary>
                    <ProtectedRoute requireAuth={false}>
                      <RegisterPage />
                    </ProtectedRoute>
                  </AuthErrorBoundary>
                } 
              />
              <Route path="/signup" element={<Navigate to="/register" replace />} />
              
              {/* Public Pages with Ride Error Boundary */}
              <Route 
                path="/ride-request" 
                element={
                  <RideErrorBoundary>
                    <RideRequestPage />
                  </RideErrorBoundary>
                } 
              />
              <Route path="/book" element={<Navigate to="/ride-request" replace />} />
              <Route 
                path="/rides" 
                element={
                  <RideErrorBoundary>
                    <RidesPage />
                  </RideErrorBoundary>
                } 
              />
              <Route path="/available-rides" element={<Navigate to="/rides" replace />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <AuthErrorBoundary>
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  </AuthErrorBoundary>
                } 
              />
              <Route 
                path="/my-profile" 
                element={<Navigate to="/profile" replace />} 
              />
              <Route 
                path="/account" 
                element={<Navigate to="/profile" replace />} 
              />
              
              {/* Development/Testing Routes */}
              <Route path="/test-data" element={<TestDataPage />} />
              
              {/* 404 Route */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/not-found" element={<Navigate to="/404" replace />} />
              
              {/* Redirect any unknown routes to 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

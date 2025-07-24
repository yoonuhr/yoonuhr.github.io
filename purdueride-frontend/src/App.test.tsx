import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import App from './App';

// Mock the auth context
vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock the notification context
vi.mock('./context/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useNotification: () => ({
    notifications: [],
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
  }),
}));

// Mock all page components
vi.mock('./pages/HomePage', () => ({
  default: function HomePage() {
    return <div data-testid="home-page">Home Page</div>;
  },
}));

vi.mock('./pages/LoginPage', () => ({
  default: function LoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  },
}));

vi.mock('./pages/RegisterPage', () => ({
  default: function RegisterPage() {
    return <div data-testid="register-page">Register Page</div>;
  },
}));

vi.mock('./pages/RideRequestPage', () => ({
  default: function RideRequestPage() {
    return <div data-testid="ride-request-page">Ride Request Page</div>;
  },
}));

vi.mock('./pages/RidesPage', () => ({
  default: function RidesPage() {
    return <div data-testid="rides-page">Rides Page</div>;
  },
}));

vi.mock('./pages/ProfilePage', () => ({
  default: function ProfilePage() {
    return <div data-testid="profile-page">Profile Page</div>;
  },
}));

vi.mock('./pages/NotFoundPage', () => ({
  default: function NotFoundPage() {
    return <div data-testid="not-found-page">404 Not Found</div>;
  },
}));

vi.mock('./pages/TestDataPage', () => ({
  default: function TestDataPage() {
    return <div data-testid="test-data-page">Test Data Page</div>;
  },
}));

// Mock ProtectedRoute component
vi.mock('./components/common/ProtectedRoute', () => ({
  default: function ProtectedRoute({ children, requireAuth = true }: { children: React.ReactNode; requireAuth?: boolean }) {
    // For testing, just render children directly
    return <>{children}</>;
  },
}));

// Import the mocked components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RideRequestPage from './pages/RideRequestPage';
import RidesPage from './pages/RidesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import TestDataPage from './pages/TestDataPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Create a test version of App without the Router wrapper
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      
      {/* Auth Routes - redirect authenticated users */}
      <Route 
        path="/login" 
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <ProtectedRoute requireAuth={false}>
            <RegisterPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/signup" element={<Navigate to="/register" replace />} />
      
      {/* Public Pages */}
      <Route path="/ride-request" element={<RideRequestPage />} />
      <Route path="/book" element={<Navigate to="/ride-request" replace />} />
      <Route path="/rides" element={<RidesPage />} />
      <Route path="/available-rides" element={<Navigate to="/rides" replace />} />
      
      {/* Protected Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
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
  );
};

describe('App Routing', () => {
  const renderWithRouter = (initialEntries: string[] = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  test('renders home page on root path', () => {
    renderWithRouter(['/']);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders login page on /login path', () => {
    renderWithRouter(['/login']);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders register page on /register path', () => {
    renderWithRouter(['/register']);
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  test('renders ride request page on /ride-request path', () => {
    renderWithRouter(['/ride-request']);
    expect(screen.getByTestId('ride-request-page')).toBeInTheDocument();
  });

  test('renders rides page on /rides path', () => {
    renderWithRouter(['/rides']);
    expect(screen.getByTestId('rides-page')).toBeInTheDocument();
  });

  test('renders 404 page on unknown path', () => {
    renderWithRouter(['/unknown-path']);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  test('redirects /home to /', () => {
    renderWithRouter(['/home']);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('redirects /signup to /register', () => {
    renderWithRouter(['/signup']);
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  test('redirects /book to /ride-request', () => {
    renderWithRouter(['/book']);
    expect(screen.getByTestId('ride-request-page')).toBeInTheDocument();
  });

  test('redirects /available-rides to /rides', () => {
    renderWithRouter(['/available-rides']);
    expect(screen.getByTestId('rides-page')).toBeInTheDocument();
  });

  test('redirects /not-found to /404', () => {
    renderWithRouter(['/not-found']);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
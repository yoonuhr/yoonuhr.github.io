import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';

// Mock components for testing
const HomePage = () => <div data-testid="home-page">Home Page</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;
const RegisterPage = () => <div data-testid="register-page">Register Page</div>;
const RideRequestPage = () => <div data-testid="ride-request-page">Ride Request Page</div>;
const RidesPage = () => <div data-testid="rides-page">Rides Page</div>;
const ProfilePage = () => <div data-testid="profile-page">Profile Page</div>;
const NotFoundPage = () => <div data-testid="not-found-page">404 Not Found</div>;

// Mock ProtectedRoute for testing
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Test routing configuration
const TestRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/home" element={<Navigate to="/" replace />} />
    
    {/* Auth Routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
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
    <Route path="/my-profile" element={<Navigate to="/profile" replace />} />
    <Route path="/account" element={<Navigate to="/profile" replace />} />
    
    {/* 404 Route */}
    <Route path="/404" element={<NotFoundPage />} />
    <Route path="/not-found" element={<Navigate to="/404" replace />} />
    
    {/* Redirect any unknown routes to 404 */}
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);

describe('React Router Navigation', () => {
  const renderWithRouter = (initialEntries: string[] = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <TestRoutes />
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

  test('renders profile page on /profile path', () => {
    renderWithRouter(['/profile']);
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
  });

  test('renders 404 page on unknown path', () => {
    renderWithRouter(['/unknown-path']);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });

  test('all route aliases work correctly', () => {
    // Test /home redirects to /
    renderWithRouter(['/home']);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    
    // Test /signup redirects to /register  
    renderWithRouter(['/signup']);
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
    
    // Test /book redirects to /ride-request
    renderWithRouter(['/book']);
    expect(screen.getByTestId('ride-request-page')).toBeInTheDocument();
    
    // Test /available-rides redirects to /rides
    renderWithRouter(['/available-rides']);
    expect(screen.getByTestId('rides-page')).toBeInTheDocument();
    
    // Test /my-profile redirects to /profile
    renderWithRouter(['/my-profile']);
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    
    // Test /account redirects to /profile
    renderWithRouter(['/account']);
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    
    // Test /not-found redirects to /404
    renderWithRouter(['/not-found']);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
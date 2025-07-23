import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { apiService } from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      {user && (
        <div data-testid="user-email">{user.email}</div>
      )}
      <button 
        data-testid="login-button" 
        onClick={() => login('test@purdue.edu', 'password')}
      >
        Login
      </button>
      <button 
        data-testid="register-button" 
        onClick={() => register({
          email: 'new@purdue.edu',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          phoneNumber: '1234567890'
        })}
      >
        Register
      </button>
      <button data-testid="logout-button" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock successful login response
    (apiService.login as any).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: '123',
          email: 'test@purdue.edu',
          firstName: 'Test',
          lastName: 'User',
          phoneNumber: '1234567890',
          isVerified: 'verified',
          createdAt: new Date()
        },
        token: 'fake-token',
        refreshToken: 'fake-refresh-token',
        expiresAt: Date.now() + 3600000 // 1 hour from now
      }
    });
    
    // Mock successful register response
    (apiService.register as any).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: '456',
          email: 'new@purdue.edu',
          firstName: 'Test',
          lastName: 'User',
          phoneNumber: '1234567890',
          isVerified: 'unverified',
          createdAt: new Date()
        },
        token: 'fake-token-new',
        refreshToken: 'fake-refresh-token-new',
        expiresAt: Date.now() + 3600000 // 1 hour from now
      }
    });
    
    // Mock successful logout response
    (apiService.logout as any).mockResolvedValue({
      success: true,
      data: { success: true }
    });
  });
  
  test('provides authentication context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });
  
  test('handles login successfully', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await user.click(screen.getByTestId('login-button'));
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@purdue.edu');
    });
    
    // Verify API was called
    expect(apiService.login).toHaveBeenCalledWith('test@purdue.edu', 'password');
    
    // Verify data was stored in localStorage
    expect(localStorage.getItem('purdueride_auth_token')).toBe('fake-token');
  });
  
  test('handles registration successfully', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click register button
    await user.click(screen.getByTestId('register-button'));
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('new@purdue.edu');
    });
    
    // Verify API was called
    expect(apiService.register).toHaveBeenCalledWith({
      email: 'new@purdue.edu',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '1234567890'
    });
    
    // Verify data was stored in localStorage
    expect(localStorage.getItem('purdueride_auth_token')).toBe('fake-token-new');
  });
  
  test('handles logout successfully', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login first
    await user.click(screen.getByTestId('login-button'));
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    
    // Now logout
    await user.click(screen.getByTestId('logout-button'));
    
    // Wait for logout to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });
    
    // Verify API was called
    expect(apiService.logout).toHaveBeenCalled();
    
    // Verify data was removed from localStorage
    expect(localStorage.getItem('purdueride_auth_token')).toBeNull();
  });
  
  test('handles login failure', async () => {
    // Mock login failure
    (apiService.login as any).mockResolvedValue({
      success: false,
      error: {
        message: 'Invalid credentials',
        code: 'AUTH_INVALID_CREDENTIALS'
      }
    });
    
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await user.click(screen.getByTestId('login-button'));
    
    // Wait for authentication attempt to complete
    await waitFor(() => {
      // Should still be unauthenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });
    
    // Verify API was called
    expect(apiService.login).toHaveBeenCalledWith('test@purdue.edu', 'password');
    
    // Verify no data was stored in localStorage
    expect(localStorage.getItem('purdueride_auth_token')).toBeNull();
  });
});
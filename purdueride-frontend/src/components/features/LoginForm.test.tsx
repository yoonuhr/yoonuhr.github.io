import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import { apiService } from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    login: vi.fn(),
    logout: vi.fn(),
  }
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('LoginForm', () => {
  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
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
  });

  test('renders login form with all fields', () => {
    renderLoginForm();
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    
    const emailInput = screen.getByLabelText(/email address/i);
    
    // Enter invalid email
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // Move focus to trigger validation
    
    // Wait for validation error
    await waitFor(() => {
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  test('validates Purdue email domain', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    
    const emailInput = screen.getByLabelText(/email address/i);
    
    // Enter non-Purdue email
    await user.type(emailInput, 'test@gmail.com');
    await user.tab(); // Move focus to trigger validation
    
    // Wait for validation error
    await waitFor(() => {
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderLoginForm();
    
    // Fill out form
    await user.type(screen.getByLabelText(/email address/i), 'test@purdue.edu');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByLabelText(/remember me/i));
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify API was called with correct data
    await waitFor(() => {
      expect(apiService.login).toHaveBeenCalledWith('test@purdue.edu', 'Password123!', true);
    });
  });

  test('displays error message on login failure', async () => {
    // Mock login failure
    (apiService.login as any).mockResolvedValue({
      success: false,
      error: {
        message: 'Invalid credentials',
        code: 'AUTH_INVALID_CREDENTIALS'
      }
    });
    
    const user = userEvent.setup();
    renderLoginForm();
    
    // Fill out form
    await user.type(screen.getByLabelText(/email address/i), 'test@purdue.edu');
    await user.type(screen.getByLabelText(/password/i), 'WrongPassword123!');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
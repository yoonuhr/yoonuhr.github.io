import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { apiService } from '../services/api';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const AUTH_TOKEN_KEY = 'purdueride_auth_token';
const AUTH_USER_KEY = 'purdueride_auth_user';
const AUTH_EXPIRY_KEY = 'purdueride_auth_expiry';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is authenticated based on stored token and expiry
  const isAuthenticated = Boolean(user);

  // Clear any authentication errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = localStorage.getItem(AUTH_USER_KEY);
        const storedExpiry = localStorage.getItem(AUTH_EXPIRY_KEY);
        
        if (storedUser && storedExpiry) {
          const expiryTime = parseInt(storedExpiry, 10);
          
          // Check if token is expired
          if (expiryTime > Date.now()) {
            // Token is still valid, restore user
            setUser(JSON.parse(storedUser));
          } else {
            // Token is expired, clear storage
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            localStorage.removeItem(AUTH_EXPIRY_KEY);
          }
        }
      } catch (err) {
        console.error('Error loading auth state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user, token, expiresAt } = response.data;
        
        // Store authentication data
        if (rememberMe) {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
          localStorage.setItem(AUTH_EXPIRY_KEY, expiresAt.toString());
        } else {
          // For session-only storage, we could use sessionStorage instead
          // But for this implementation we'll just use localStorage
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
          localStorage.setItem(AUTH_EXPIRY_KEY, expiresAt.toString());
        }
        
        setUser(user);
        return true;
      } else {
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during login';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user, token, expiresAt } = response.data;
        
        // Store authentication data
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_EXPIRY_KEY, expiresAt.toString());
        
        setUser(user);
        return true;
      } else {
        throw new Error(response.error?.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during registration';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await apiService.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      // Clear stored auth data regardless of API response
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_EXPIRY_KEY);
      
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Create the context value object
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
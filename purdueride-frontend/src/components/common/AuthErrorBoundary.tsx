import { Component, type ErrorInfo, type ReactNode } from 'react';
import Button from './Button';
import ErrorLogger from '../../services/errorLogger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error using our error logging service
    const errorLogger = ErrorLogger.getInstance();
    errorLogger.logError(error, errorInfo, 'AuthErrorBoundary');
    
    // Log authentication-specific errors with additional context
    if (error.message.includes('auth') || error.message.includes('login') || error.message.includes('token')) {
      errorLogger.logError(error, errorInfo, 'AuthErrorBoundary:AuthSpecific');
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoToLogin = () => {
    // Clear any potentially corrupted auth state
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 0h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-6">
              There was a problem with your authentication. Please try logging in again.
            </p>
            <div className="space-y-3">
              <Button
                onClick={this.handleGoToLogin}
                className="w-full"
                variant="primary"
              >
                Go to Login
              </Button>
              <Button
                onClick={this.handleRetry}
                className="w-full"
                variant="secondary"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
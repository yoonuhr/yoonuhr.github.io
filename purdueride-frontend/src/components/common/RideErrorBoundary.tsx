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

class RideErrorBoundary extends Component<Props, State> {
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
    errorLogger.logError(error, errorInfo, 'RideErrorBoundary');
    
    // Log ride-specific errors with additional context
    if (error.message.includes('ride') || error.message.includes('booking') || error.message.includes('request')) {
      errorLogger.logError(error, errorInfo, 'RideErrorBoundary:RideSpecific');
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoToRides = () => {
    window.location.href = '/rides';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ride Service Error
          </h3>
          <p className="text-gray-600 mb-4">
            We're having trouble loading ride information. Please try again or check available rides.
          </p>
          <div className="space-y-2">
            <Button
              onClick={this.handleRetry}
              className="w-full"
              variant="primary"
            >
              Try Again
            </Button>
            <Button
              onClick={this.handleGoToRides}
              className="w-full"
              variant="secondary"
            >
              View Available Rides
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RideErrorBoundary;
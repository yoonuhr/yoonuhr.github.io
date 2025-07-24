import { type ErrorInfo } from 'react';

export interface ErrorLogEntry {
  timestamp: Date;
  error: Error;
  errorInfo?: ErrorInfo;
  userAgent: string;
  url: string;
  userId?: string;
  context?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLogEntry[] = [];

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  logError(error: Error, errorInfo?: ErrorInfo, context?: string, userId?: string): void {
    const logEntry: ErrorLogEntry = {
      timestamp: new Date(),
      error,
      errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId,
      context,
    };

    // Store locally for debugging
    this.logs.push(logEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Logged');
      console.error('Error:', error);
      console.error('Context:', context);
      console.error('Error Info:', errorInfo);
      console.error('Full Log Entry:', logEntry);
      console.groupEnd();
    }

    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      void this.sendToErrorService(logEntry);
    }
  }

  // Placeholder for future error reporting service integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async sendToErrorService(logEntry: ErrorLogEntry): Promise<void> {
    try {
      // This would be replaced with actual error reporting service call
      // Example: Sentry, LogRocket, Bugsnag, etc.
      console.log('Would send to error service:', logEntry);
      
      // Example implementation:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
    } catch (sendError) {
      console.error('Failed to send error to logging service:', sendError);
    }
  }

  // Get recent errors for debugging
  getRecentErrors(limit: number = 10): ErrorLogEntry[] {
    return this.logs.slice(-limit);
  }

  // Clear error logs (useful for testing)
  clearLogs(): void {
    this.logs = [];
  }

  // Get error statistics
  getErrorStats(): { total: number; byContext: Record<string, number> } {
    const byContext: Record<string, number> = {};
    
    this.logs.forEach(log => {
      const context = log.context || 'unknown';
      byContext[context] = (byContext[context] || 0) + 1;
    });

    return {
      total: this.logs.length,
      byContext,
    };
  }
}

export default ErrorLogger;
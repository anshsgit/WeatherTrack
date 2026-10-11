/**
 * ErrorBoundary.jsx
 * React class component for catching unexpected rendering errors.
 * Displays a friendly fallback UI instead of a blank crash screen.
 * Demonstrates: class-based error boundaries (only possible with class components in React).
 */
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  // Invoked when a child component throws during rendering
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'An unknown error occurred.' };
  }

  // Log error details for debugging (in production, send to an error tracking service)
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught an error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page" role="alert">
          <div className="error-page-code">Oops!</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 460, marginBottom: '1.5rem' }}>
            An unexpected error occurred while rendering this page. The error details
            have been logged to the console.
          </p>
          <div
            className="alert alert-error"
            style={{ maxWidth: 480, textAlign: 'left', marginBottom: '1.5rem' }}
          >
            <code style={{ fontSize: '0.82rem' }}>{this.state.errorMessage}</code>
          </div>
          <button id="error-boundary-reset-btn" className="btn btn-primary" onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

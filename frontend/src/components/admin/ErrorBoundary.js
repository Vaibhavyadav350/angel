import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-champagne font-body">
          <div className="text-center space-y-4">
            <h1 className="font-editorial text-3xl font-black text-bronze uppercase">
              Something went wrong
            </h1>
            <p className="text-sm text-bronze/50">
              Please refresh the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

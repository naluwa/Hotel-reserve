import React from "react";
import { ErrorState } from "./States";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cashmere-900 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <ErrorState
              title="Application Error"
              message={
                this.state.error?.message || "An unexpected error occurred"
              }
              details={
                process.env.NODE_ENV === "development"
                  ? this.state.errorInfo?.componentStack
                  : undefined
              }
              onRetry={this.handleReset}
              retryLabel="Try Again"
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

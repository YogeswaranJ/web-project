// ErrorBoundary.jsx
// Experiment 4g & 4h: Reusable ErrorBoundary Component to catch unexpected runtime/rendering errors

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Button from "./Button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.href = "/";
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container" role="alert">
          <div className="error-boundary-card">
            <div className="error-icon-wrapper">
              <AlertTriangle className="error-icon" size={48} />
            </div>
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-description">
              Our hospital system encountered an unexpected error while rendering this view.
              Your booking data is preserved.
            </p>

            {this.state.error && (
              <details className="error-details-collapsible">
                <summary>Technical Details (For Lab Assessment)</summary>
                <div className="error-stack-code">
                  <code>{this.state.error.toString()}</code>
                  {this.state.errorInfo && (
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  )}
                </div>
              </details>
            )}

            <div className="error-actions">
              <Button
                variant="primary"
                icon={RefreshCw}
                onClick={this.handleReset}
              >
                Reload & Try Again
              </Button>
              <Button
                variant="outline"
                icon={Home}
                onClick={() => (window.location.href = "/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

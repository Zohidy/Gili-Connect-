import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-red-50 text-red-900">
          <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-xl border border-red-200">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h1>
            <p className="mb-4 font-semibold">The application crashed with the following error:</p>
            <pre className="bg-red-100 p-4 rounded-lg overflow-auto text-sm font-mono mb-6 border border-red-200">
              {this.state.error && this.state.error.toString()}
            </pre>
            <details className="whitespace-pre-wrap text-xs text-gray-600 bg-gray-50 p-4 rounded border border-gray-200">
              <summary className="cursor-pointer mb-2 font-medium">Component Stack Trace</summary>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { useState, useEffect, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
      // Note: ErrorEvent doesn't provide ErrorInfo directly, 
      // but this is a functional approach to error boundaries.
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-red-50 text-red-900">
        <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-xl border border-red-200">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h1>
          <p className="mb-4 font-semibold">The application crashed with the following error:</p>
          <pre className="bg-red-100 p-4 rounded-lg overflow-auto text-sm font-mono mb-6 border border-red-200">
            {error && error.toString()}
          </pre>
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

  return <>{children}</>;
};

export default ErrorBoundary;

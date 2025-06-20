import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Preview Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center p-8">
          <Card className="max-w-md mx-auto p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Preview Error
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-red-700 dark:text-red-300 text-sm">
                {this.state.error?.message || 'An error occurred while rendering the preview.'}
              </p>

              {this.state.errorInfo?.componentStack && (
                <details className="text-xs text-red-600 dark:text-red-400">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}

              <div className="flex space-x-2 pt-2">
                <Button
                  onClick={this.handleRetry}
                  size="sm"
                  variant="outline"
                  className="text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/30"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>

              <div className="text-xs text-red-600 dark:text-red-400 pt-2 border-t border-red-200 dark:border-red-800">
                <p className="font-medium">Common fixes:</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Check for JavaScript syntax errors</li>
                  <li>Ensure all HTML tags are properly closed</li>
                  <li>Verify CSS syntax is valid</li>
                  <li>Check console for additional error details</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PreviewErrorBoundary;

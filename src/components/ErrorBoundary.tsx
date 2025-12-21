import { Component, ErrorInfo, ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <MaterialIcon
              name="error_outline"
              className="text-red-500"
              size="xl"
            />
          </div>
          <h2 className="text-xl font-semibold text-woodland-text-main mb-2">
            Something went wrong
          </h2>
          <p className="text-woodland-text-muted mb-6 max-w-md">
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 text-left max-w-lg">
              <summary className="cursor-pointer text-sm text-woodland-text-muted hover:text-woodland-text-main">
                Error details
              </summary>
              <pre className="mt-2 p-4 bg-woodland-surface-light rounded-lg text-xs overflow-auto">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

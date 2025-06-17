"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/utils";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo);
    handleError(error, "An unexpected error occurred");
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  // error,
  reset,
}: {
  error?: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-4 text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        An unexpected error occurred. Please try refreshing the page.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button onClick={() => window.location.reload()}>Refresh page</Button>
      </div>
    </div>
  );
}

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
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
    errorInfo: null,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: _, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", {
      error,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      // Add more context here if available, e.g., user info, current route
    });
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          role="alert"
          style={{
            padding: "20px",
            margin: "20px",
            border: "1px solid #dc3545",
            borderRadius: "5px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <h2>Terjadi Kesalahan Tak Terduga!</h2>
          <p>
            Maaf, ada yang tidak beres. Silakan coba{" "}
            <a
              href="javascript:window.location.reload()"
              style={{ color: "#007bff", textDecoration: "underline" }}
            >
              muat ulang halaman
            </a>{" "}
            atau laporkan masalah ini jika terus berlanjut.
          </p>
          {this.state.error && (
            <details style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

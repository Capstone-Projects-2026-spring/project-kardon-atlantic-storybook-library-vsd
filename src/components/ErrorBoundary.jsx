import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "100%", gap: 16, padding: 32,
          color: "#2a4a6b", textAlign: "center",
        }}>
          <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Something went wrong</h2>
          <p style={{ margin: 0, color: "#5a7a9a", maxWidth: 400 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "10px 24px", borderRadius: 12, border: "1.5px solid rgba(42,74,107,0.3)",
              background: "rgba(255,255,255,0.7)", color: "#1e3a5f", cursor: "pointer",
              fontSize: "1rem", fontWeight: 600,
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

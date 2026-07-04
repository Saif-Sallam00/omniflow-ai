import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";
import "./index.css";

// Simple Error Boundary to catch crashes
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", fontFamily: "sans-serif" }}>
          <h1>Something went wrong.</h1>
          <pre style={{ background: "#f0f0f0", padding: "10px", borderRadius: "5px" }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Context from "./utills/Context.jsx";

// Error handling function
const handleErrors = (error, errorInfo) => {
  if (
    error.message.includes(
      "Cannot read properties of undefined (reading 'direction')"
    ) ||
    (errorInfo &&
      errorInfo.componentStack &&
      errorInfo.componentStack.includes(
        "chrome-extension://aggiiclaiamajehmlfpkjmlbadmkledi"
      ))
  ) {
    // Suppress the specific Chrome extension error
    console.log("Suppressed Chrome extension error");
    return;
  }
  // Log other errors as usual
  console.error("Uncaught error:", error, errorInfo);
};

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    handleErrors(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Modify console.error to filter out the Chrome extension errors
const originalConsoleError = console.error;
console.error = function (...args) {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("chrome-extension://aggiiclaiamajehmlfpkjmlbadmkledi") ||
      args[0].includes(
        "Cannot read properties of undefined (reading 'direction')"
      ))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Context>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Context>
    </ErrorBoundary>
  </React.StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { handleChunkLoadFailure } from "./lib/lazyWithRetry";
import "./index.css";

// Recover automatically if Vite encounters a stale chunk hash after deployment
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    console.warn("Vite chunk preload error, reloading to fetch fresh assets:", event);
    handleChunkLoadFailure();
  });
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

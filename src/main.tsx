import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
const oldError = console.error;
console.error = (...args) => {
  const msg = args.map(a => {
    try {
      if (a instanceof Error) return a.stack || a.message;
      return typeof a === 'string' ? a : JSON.stringify(a);
    } catch(e) { return String(a); }
  }).join(' ');
  fetch('http://localhost:9999/', { method: 'POST', body: msg }).catch(()=>{});
  oldError(...args);
};

window.addEventListener("error", (e) => {
  const msg = `Error: ${e.message}\nFile: ${e.filename}:${e.lineno}\nStack: ${e.error?.stack || 'none'}`;
  fetch('http://localhost:9999/', { method: 'POST', body: msg }).catch(()=>{});
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = `Unhandled Rejection: ${e.reason?.stack || String(e.reason)}`;
  fetch('http://localhost:9999/', { method: 'POST', body: msg }).catch(()=>{});
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

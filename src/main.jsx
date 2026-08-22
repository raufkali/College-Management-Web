import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// ✅ Load Bootstrap Icons from CDN (for admin panel)
const bootstrapIcons = document.createElement("link");
bootstrapIcons.rel = "stylesheet";
bootstrapIcons.href =
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
document.head.appendChild(bootstrapIcons);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

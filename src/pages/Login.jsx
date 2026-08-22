import React, { useState } from "react";
import { api, endpoints } from "../services/api";

export function Login({ onLogin }) {
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await api.post(endpoints.auth.login, {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login response:", res.data);

      if (res.data?.success && res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);

        // Tell the parent application that login succeeded
        onLogin();
      } else {
        setError(res.data?.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to the server. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{
        background:
          "linear-gradient(135deg, #0b3d91 0%, #1557b0 50%, #1e73d8 100%)",
      }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: "420px",
        }}
      >
        {/* =========================================
            HEADER
        ========================================== */}
        <div className="text-center mb-4">
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle shadow"
            style={{
              width: "72px",
              height: "72px",
              background: "#ffffff",
              color: "#1557b0",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            GDC
          </div>

          <h1
            className="text-white fw-bold mt-3 mb-1"
            style={{
              fontSize: "1.8rem",
            }}
          >
            Govt. Degree College
          </h1>

          <p
            className="text-white-50 mb-0"
            style={{
              letterSpacing: "0.12em",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Administration Portal
          </p>
        </div>

        {/* =========================================
            LOGIN CARD
        ========================================== */}
        <div
          className="card border-0 shadow-lg p-4"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            borderRadius: "18px",
          }}
        >
          {/* Card Header */}
          <div className="text-center mb-4">
            <h4
              className="fw-bold mb-1"
              style={{
                color: "#123b75",
              }}
            >
              Administrator Sign In
            </h4>

            <p className="text-muted small mb-0">
              Sign in to access the administration dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger py-2 px-3 small" role="alert">
              {error}
            </div>
          )}

          {/* =========================================
              LOGIN FORM
          ========================================== */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="admin-email" className="form-label fw-semibold">
                Email Address
              </label>

              <input
                id="admin-email"
                type="email"
                className="form-control"
                placeholder="Enter administrator email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                autoFocus
                disabled={busy}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="admin-password"
                className="form-label fw-semibold"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                disabled={busy}
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="btn w-100 fw-bold text-white"
              disabled={busy}
              style={{
                background: "linear-gradient(135deg, #1557b0, #1e73d8)",
                border: "none",
                padding: "11px",
                borderRadius: "10px",
              }}
            >
              {busy ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="text-center mt-4">
            <small className="text-muted">Authorized administrators only</small>
          </div>
        </div>

        {/* =========================================
            PAGE FOOTER
        ========================================== */}
        <p className="text-center text-white-50 small mt-4 mb-0">
          © {new Date().getFullYear()} Govt. Degree College
        </p>
      </div>
    </div>
  );
}

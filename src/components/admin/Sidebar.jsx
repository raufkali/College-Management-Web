import React from "react";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
  { key: "teachers", label: "Faculty", icon: "bi-people-fill" },
  { key: "notices", label: "Notices", icon: "bi-megaphone-fill" },
  { key: "results", label: "Results", icon: "bi-file-pdf-fill" },
  { key: "departments", label: "Departments", icon: "bi-building" },
  { key: "media", label: "Media", icon: "bi-images" },
];

export function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  onPrincipalClick,
}) {
  return (
    <div
      className="bg-dark text-white p-4 d-flex flex-column justify-content-between"
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1050,
        overflowY: "auto",
      }}
    >
      <div>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            GDC
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>
              GDC Admin
            </h4>
            <p className="text-white-50 small mb-0">Gulabad Campus</p>
          </div>
        </div>

        {/* Navigation - No counts */}
        <div className="d-grid gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn text-start py-2 ${
                activeTab === tab.key
                  ? "btn-primary text-white"
                  : "btn-dark text-white-50"
              }`}
              style={{ borderRadius: "8px", border: "none" }}
            >
              <i className={`bi ${tab.icon} me-2`}></i> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="d-grid gap-2 pt-3 border-top border-secondary">
        <button
          onClick={onPrincipalClick}
          className="btn btn-outline-info text-start py-2"
          style={{ borderRadius: "8px" }}
        >
          <i className="bi bi-person-badge me-2"></i> Principal Desk
        </button>
        <button
          onClick={onLogout}
          className="btn btn-outline-danger text-start py-2"
          style={{ borderRadius: "8px" }}
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { Sidebar } from "../../components/admin/Sidebar";
import { ToastStack } from "../../components/common/Toast";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export function AdminLayout({
  children,
  activeTab,
  setActiveTab,
  stats,
  onLogout,
  onPrincipalClick,
  toasts,
  dismissToast,
  confirmConfig,
  setConfirmConfig,
  showDrawer,
  setShowDrawer,
  onCloseDrawer,
  drawerTitle,
  drawerContent,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Mobile toggle - visible only on small screens */}
      <button
        className="btn btn-dark text-white d-md-none position-fixed"
        style={{
          top: "16px",
          left: "16px",
          zIndex: 1070,
          padding: "8px 12px",
          borderRadius: "8px",
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="bi bi-list fs-4"></i>
      </button>

      {/* Sidebar - Fixed position */}
      <div
        className={`${sidebarOpen ? "d-block" : "d-none d-md-block"}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1050,
          width: "260px",
        }}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          onPrincipalClick={onPrincipalClick}
        />
      </div>

      {/* Main Content - with left margin for sidebar */}
      <div
        className="p-4 p-md-5 w-100 overflow-auto"
        style={{
          marginLeft: "260px", // ✅ Push content to the right
          maxHeight: "100vh",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>

      {/* Toasts */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* Confirm Dialog */}
      {confirmConfig && (
        <ConfirmDialog
          config={confirmConfig}
          onCancel={() => setConfirmConfig(null)}
          onConfirm={() => {
            setConfirmConfig(null);
          }}
        />
      )}

      {/* Drawer Modal */}
      {showDrawer && (
        <div
          className="modal d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1075,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onCloseDrawer();
            }
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ width: "100%", maxWidth: "600px", margin: "auto" }}
          >
            <div className="modal-content border-0 shadow-lg rounded-4 p-3">
              <div className="modal-header border-0">
                <h5 className="fw-bold" style={{ color: "#0f1a3a" }}>
                  {drawerTitle || "Add Item"}
                </h5>
                <button
                  className="btn-close"
                  onClick={onCloseDrawer}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                {drawerContent || <p>Loading content...</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

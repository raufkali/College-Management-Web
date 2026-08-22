import React, { useState, useEffect } from "react";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { Dashboard } from "../pages/admin/Dashboard";
import { Teachers } from "../pages/admin/Teachers";
import { Notices } from "../pages/admin/Notices";
import { Results } from "../pages/admin/Results";
import { Departments } from "../pages/admin/Departments";
import { Media } from "../pages/admin/Media";
import { PrincipalDesk } from "../pages/admin/PrincipalDesk";
import { Login } from "../pages/Login";

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerContent, setDrawerContent] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confirmConfig, setConfirmConfig] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    pushToast("Signed out.", "info");
  };

  const pushToast = (message, variant = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openDrawer = (title, content) => {
    setDrawerTitle(title);
    setDrawerContent(content);
    setShowDrawer(true);
  };

  const forceCloseDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => {
      setDrawerContent(null);
      setDrawerTitle("");
    }, 300);
  };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "teachers":
        return <Teachers pushToast={pushToast} />;
      case "notices":
        return <Notices pushToast={pushToast} />;
      case "results":
        return <Results pushToast={pushToast} />;
      case "departments":
        return <Departments pushToast={pushToast} />;
      case "media":
        return <Media pushToast={pushToast} />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      onPrincipalClick={() =>
        openDrawer(
          "Principal Desk Settings",
          <PrincipalDesk pushToast={pushToast} onClose={forceCloseDrawer} />,
        )
      }
      toasts={toasts}
      dismissToast={dismissToast}
      confirmConfig={confirmConfig}
      setConfirmConfig={setConfirmConfig}
      showDrawer={showDrawer}
      setShowDrawer={setShowDrawer}
      onCloseDrawer={forceCloseDrawer}
      drawerTitle={drawerTitle}
      drawerContent={drawerContent}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {renderPage()}
    </AdminLayout>
  );
}

export default AdminPanel;

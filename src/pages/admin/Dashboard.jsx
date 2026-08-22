import React, { useState, useEffect } from "react";
import { api, endpoints } from "../../services/api";

export function Dashboard() {
  const [stats, setStats] = useState({
    teachers: 0,
    notices: 0,
    results: 0,
    departments: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [teachers, notices, results, departments, media] =
          await Promise.all([
            api.get(endpoints.faculty),
            api.get(endpoints.announcements),
            api.get(endpoints.results),
            api.get(endpoints.departments),
            api.get(endpoints.media),
          ]);
        setStats({
          teachers: teachers.data?.length || 0,
          notices: notices.data?.length || 0,
          results: results.data?.length || 0,
          departments: departments.data?.length || 0,
          media: media.data?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const cards = [
    {
      key: "teachers",
      label: "Faculty Members",
      icon: "bi-people-fill",
      color: "primary",
      count: stats.teachers,
    },
    {
      key: "notices",
      label: "Notices",
      icon: "bi-megaphone-fill",
      color: "warning",
      count: stats.notices,
    },
    {
      key: "results",
      label: "Results",
      icon: "bi-file-pdf-fill",
      color: "success",
      count: stats.results,
    },
    {
      key: "departments",
      label: "Departments",
      icon: "bi-building",
      color: "info",
      count: stats.departments,
    },
    {
      key: "media",
      label: "Media Items",
      icon: "bi-images",
      color: "secondary",
      count: stats.media,
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#0f1a3a" }}>
            Dashboard
          </h2>
          <div
            className="border-bottom border-primary"
            style={{ width: "56px", borderWidth: "3px !important" }}
          />
        </div>
      </div>

      <div className="row g-3">
        {cards.map((card) => (
          <div key={card.key} className="col-md-4 col-lg-3">
            <div className="card border-0 shadow-sm p-4 text-center">
              <div className={`text-${card.color} fs-1 mb-2`}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <h3 className="fw-bold mb-0">{card.count}</h3>
              <p className="text-muted small mb-0">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="card border-0 shadow-sm p-4">
          <h5 className="fw-bold mb-3">Welcome to GDC Admin Panel</h5>
          <p className="text-muted">
            Use the sidebar to manage different sections of your college
            website.
          </p>
          <div className="row g-2 mt-2">
            <div className="col-auto">
              <span className="badge bg-primary">
                Faculty: {stats.teachers}
              </span>
            </div>
            <div className="col-auto">
              <span className="badge bg-warning">Notices: {stats.notices}</span>
            </div>
            <div className="col-auto">
              <span className="badge bg-success">Results: {stats.results}</span>
            </div>
            <div className="col-auto">
              <span className="badge bg-info">
                Departments: {stats.departments}
              </span>
            </div>
            <div className="col-auto">
              <span className="badge bg-secondary">Media: {stats.media}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

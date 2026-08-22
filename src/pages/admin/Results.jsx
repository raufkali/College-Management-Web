import React, { useState, useEffect } from "react";
import { api, endpoints, API_BASE_URL } from "../../services/api";
import { Spinner } from "../../components/common/Spinner";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
];
const SESSIONS = ["2022-2026", "2023-2027", "2024-2028"];
const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

export function Results({ pushToast }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: DEPARTMENTS[0],
    session: SESSIONS[0],
    semester: SEMESTERS[0],
    file: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(endpoints.results);
      // Handle both array and object responses
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setResults(data);
    } catch (err) {
      console.error("Load error:", err);
      if (err.response?.status === 404) {
        setResults([]); // Empty array for 404
      } else {
        setError("Failed to load results");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      await api.delete(`${endpoints.results}/${id}`);
      setResults(results.filter((r) => r._id !== id));
      pushToast("Result deleted.", "success");
    } catch (err) {
      pushToast("Failed to delete.", "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      pushToast("Only PDF files are accepted.", "error");
      e.target.value = "";
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      pushToast("PDF exceeds 15MB.", "error");
      e.target.value = "";
      return;
    }
    setFormData({ ...formData, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title) errors.title = "Required";
    if (!formData.file) errors.file = "Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("department", formData.department);
      body.append("session", formData.session);
      body.append("semester", formData.semester);
      body.append("resultPdf", formData.file);

      const res = await api.post("/results/upload-pdf", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const saved = res.data?.data || res.data;
      setResults([saved, ...results]);
      setShowForm(false);
      setFormData({
        title: "",
        department: DEPARTMENTS[0],
        session: SESSIONS[0],
        semester: SEMESTERS[0],
        file: null,
      });
      setFormErrors({});
      pushToast("Result uploaded.", "success");
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to upload.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = results.filter((r) =>
    [r.title, r.department, r.semester]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#0f1a3a" }}>
            Result Ledgers
          </h2>
          <div
            className="border-bottom border-primary"
            style={{ width: "56px", borderWidth: "3px !important" }}
          />
        </div>
        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control"
            placeholder="Search results…"
            style={{ width: "200px", borderRadius: "30px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-lg me-2"></i> Upload
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-file-pdf fs-1 text-muted"></i>
          <p className="text-muted mt-3">
            {searchTerm ? "No matches." : "No results uploaded yet."}
          </p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Department</th>
                  <th>Session</th>
                  <th>Semester</th>
                  <th>Uploaded</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r._id || r.id}>
                    <td className="fw-semibold">{r.department}</td>
                    <td>{r.session}</td>
                    <td>
                      <span className="badge bg-secondary">{r.semester}</span>
                    </td>
                    <td>
                      {r.updatedAt
                        ? new Date(r.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="text-end text-nowrap">
                      {r.pdfUrl && (
                        <>
                          <a
                            href={`${API_BASE_URL.replace(/\/api\/?$/, "")}${r.pdfUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-primary me-1"
                          >
                            <i className="bi bi-eye"></i>
                          </a>
                          <a
                            href={`${API_BASE_URL.replace(/\/api\/?$/, "")}${r.pdfUrl}`}
                            download
                            className="btn btn-sm btn-outline-primary me-1"
                          >
                            <i className="bi bi-download"></i>
                          </a>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(r._id || r.id)}
                        className="btn btn-sm text-danger"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          className="modal d-block show"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1075 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setFormErrors({});
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-3">
              <div className="modal-header border-0">
                <h5 className="fw-bold">Upload Result</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({});
                  }}
                />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className={`form-control mb-3 ${formErrors.title ? "is-invalid" : ""}`}
                    placeholder="Result Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {formErrors.title && (
                    <div className="invalid-feedback">Required</div>
                  )}

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">
                        Department
                      </label>
                      <select
                        className="form-select"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">
                        Session
                      </label>
                      <select
                        className="form-select"
                        value={formData.session}
                        onChange={(e) =>
                          setFormData({ ...formData, session: e.target.value })
                        }
                      >
                        {SESSIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">
                        Semester
                      </label>
                      <select
                        className="form-select"
                        value={formData.semester}
                        onChange={(e) =>
                          setFormData({ ...formData, semester: e.target.value })
                        }
                      >
                        {SEMESTERS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">
                      PDF File (max 15MB)
                    </label>
                    <input
                      type="file"
                      className={`form-control ${formErrors.file ? "is-invalid" : ""}`}
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                    {formErrors.file && (
                      <div className="invalid-feedback">Required</div>
                    )}
                    {formData.file && (
                      <div className="mt-1 small text-success">
                        <i className="bi bi-check-circle-fill me-1"></i>{" "}
                        {formData.file.name}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    disabled={submitting}
                  >
                    {submitting && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}
                    Upload Result
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

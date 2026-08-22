import React, { useState, useEffect } from "react";
import { api, endpoints } from "../../services/api";
import { Spinner } from "../../components/common/Spinner";

export function Departments({ pushToast }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hod: "",
    description: "",
    courses: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.departments);
      setDepartments(res.data || []);
    } catch (err) {
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await api.delete(`${endpoints.departments}/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
      pushToast("Department deleted.", "success");
    } catch (err) {
      pushToast("Failed to delete.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name) errors.name = "Required";
    if (!formData.hod) errors.hod = "Required";
    if (!formData.description) errors.description = "Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const courses = formData.courses
        ? formData.courses
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];
      const res = await api.post(endpoints.departments, {
        ...formData,
        courses,
      });
      setDepartments([res.data, ...departments]);
      setShowForm(false);
      setFormData({ name: "", hod: "", description: "", courses: "" });
      pushToast("Department created.", "success");
    } catch (err) {
      pushToast("Failed to create.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = departments.filter((d) =>
    [d.name, d.hod].join(" ").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#0f1a3a" }}>
            Departments
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
            placeholder="Search departments…"
            style={{ width: "200px", borderRadius: "30px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-lg me-2"></i> Add
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-building fs-1 text-muted"></i>
          <p className="text-muted mt-3">
            {searchTerm ? "No matches." : "No departments yet."}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((d) => (
            <div key={d._id} className="col-md-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="fw-bold" style={{ color: "#0f1a3a" }}>
                    {d.name}
                  </h5>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="btn btn-sm text-danger"
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
                <p className="mb-2">
                  <strong>HOD:</strong> {d.hod}
                </p>
                <p className="text-muted small">{d.description}</p>
                <div>
                  {d.courses?.map((c, i) => (
                    <span key={i} className="badge bg-light text-dark me-1">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          className="modal d-block show"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1075 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-3">
              <div className="modal-header border-0">
                <h5 className="fw-bold">Add Department</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.name ? "is-invalid" : ""}`}
                    placeholder="Department Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">Required</div>
                  )}
                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.hod ? "is-invalid" : ""}`}
                    placeholder="Head of Department"
                    value={formData.hod}
                    onChange={(e) =>
                      setFormData({ ...formData, hod: e.target.value })
                    }
                  />
                  {formErrors.hod && (
                    <div className="invalid-feedback">Required</div>
                  )}
                  <textarea
                    className={`form-control mb-2 ${formErrors.description ? "is-invalid" : ""}`}
                    rows="2"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  {formErrors.description && (
                    <div className="invalid-feedback">Required</div>
                  )}
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Courses (comma separated)"
                    value={formData.courses}
                    onChange={(e) =>
                      setFormData({ ...formData, courses: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-primary w-100"
                    disabled={submitting}
                  >
                    {submitting && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}{" "}
                    Create Department
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

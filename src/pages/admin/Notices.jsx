import React, { useState, useEffect } from "react";
import { api, endpoints } from "../../services/api";
import { Spinner } from "../../components/common/Spinner";

const CATEGORIES = ["General", "Admission", "Exams", "Events", "Holidays"];

export function Notices({ pushToast }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    details: "",
    extraDetails: "",
    fileUrl: "",
    imageUrl: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(endpoints.announcements);
      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load error:", err);
      if (err.code === "ERR_NETWORK" || err.response?.status === 500) {
        setError("Failed to connect to server. Please try again.");
      } else {
        setNotices([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      pushToast("Image size should be less than 5MB.", "error");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      pushToast("Please upload an image file.", "error");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await api.delete(`${endpoints.announcements}/${id}`);
      setNotices(notices.filter((n) => n._id !== id));
      pushToast("Notice deleted.", "success");
    } catch (err) {
      pushToast("Failed to delete.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title) errors.title = "Required";
    if (!formData.details) errors.details = "Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(endpoints.announcements, {
        ...formData,
        date: new Date().toISOString(),
      });
      setNotices([res.data, ...notices]);
      setShowForm(false);
      setFormData({
        title: "",
        category: "General",
        details: "",
        extraDetails: "",
        fileUrl: "",
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreview("");
      setFormErrors({});
      pushToast("Notice published.", "success");
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to publish.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = notices.filter((n) => {
    const searchStr = searchTerm.toLowerCase().trim();
    if (!searchStr) return true;
    const text = [n.title, n.category, n.details]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(searchStr);
  });

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <button className="btn btn-sm btn-outline-danger" onClick={loadData}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: "#0f1a3a" }}>
            Notice Board
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
            placeholder="Search notices…"
            style={{ width: "200px", borderRadius: "30px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => {
              setShowForm(true);
              setFormErrors({});
              setImagePreview("");
            }}
          >
            <i className="bi bi-plus-lg me-2"></i> Add
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <p className="text-muted mt-3">
            {searchTerm
              ? "No notices match your search."
              : "No notices yet. Click 'Add' to create your first notice."}
          </p>
          {!searchTerm && (
            <button
              className="btn btn-primary rounded-pill px-4 mt-2"
              onClick={() => {
                setShowForm(true);
                setFormErrors({});
              }}
            >
              <i className="bi bi-plus-lg me-2"></i> Create First Notice
            </button>
          )}
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((n) => (
                  <tr key={n._id || n.id}>
                    <td>
                      {n.imageUrl ? (
                        <img
                          src={n.imageUrl}
                          alt="Notice"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-dark">
                        {n.category || "General"}
                      </span>
                    </td>
                    <td className="fw-semibold">{n.title || "Untitled"}</td>
                    <td>
                      {n.date ? new Date(n.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDelete(n._id || n.id)}
                        className="btn btn-sm text-danger"
                        title="Delete notice"
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
              setImagePreview("");
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg p-3">
              <div className="modal-header border-0">
                <h5 className="fw-bold">Create Notice</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({});
                    setImagePreview("");
                  }}
                />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.title ? "is-invalid" : ""}`}
                    placeholder="Title *"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {formErrors.title && (
                    <div className="invalid-feedback d-block mb-1">
                      Title is required
                    </div>
                  )}

                  <select
                    className="form-select mb-2"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  <div className="mb-2">
                    <label className="form-label small fw-bold">
                      Notice Image (optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <small className="text-muted">Max 5MB. JPG, PNG, GIF</small>
                    {imagePreview && (
                      <div className="mt-1">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm text-danger ms-2"
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                            setFormData({ ...formData, imageUrl: "" });
                          }}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <textarea
                    className={`form-control mb-2 ${formErrors.details ? "is-invalid" : ""}`}
                    rows="3"
                    placeholder="Details *"
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                  />
                  {formErrors.details && (
                    <div className="invalid-feedback d-block mb-1">
                      Details are required
                    </div>
                  )}

                  <textarea
                    className="form-control mb-2"
                    rows="2"
                    placeholder="Extra Details (optional)"
                    value={formData.extraDetails}
                    onChange={(e) =>
                      setFormData({ ...formData, extraDetails: e.target.value })
                    }
                  />

                  <input
                    type="url"
                    className="form-control mb-2"
                    placeholder="File URL (optional)"
                    value={formData.fileUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, fileUrl: e.target.value })
                    }
                  />

                  <button
                    className="btn btn-primary w-100"
                    disabled={submitting}
                  >
                    {submitting && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}
                    Publish Notice
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

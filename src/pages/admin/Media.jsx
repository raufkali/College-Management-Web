import React, { useState, useEffect } from "react";
import { api, endpoints } from "../../services/api";
import { Spinner } from "../../components/common/Spinner";

const CATEGORIES = ["campus", "events", "sports"];

export function Media({ pushToast }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "image",
    category: "campus",
    date: "Recent",
    description: "",
    url: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [filePreview, setFilePreview] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.media);
      setMedia(res.data || []);
    } catch (err) {
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      pushToast("File exceeds 15MB limit.", "error");
      e.target.value = "";
      return;
    }

    // Validate file type based on media type
    if (formData.type === "image" && !file.type.startsWith("image/")) {
      pushToast("Please upload an image file.", "error");
      e.target.value = "";
      return;
    }
    if (formData.type === "video" && !file.type.startsWith("video/")) {
      pushToast("Please upload a video file.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
      setFormData({ ...formData, url: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media item?")) return;
    try {
      await api.delete(`${endpoints.media}/${id}`);
      setMedia(media.filter((m) => m._id !== id));
      pushToast("Media deleted.", "success");
    } catch (err) {
      pushToast("Failed to delete.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title) errors.title = "Required";
    if (!formData.url) errors.url = "Required";
    if (!formData.description) errors.description = "Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(endpoints.media, {
        ...formData,
        location: "Main Campus",
      });
      setMedia([res.data, ...media]);
      setShowForm(false);
      setFormData({
        title: "",
        type: "image",
        category: "campus",
        date: "Recent",
        description: "",
        url: "",
      });
      setFilePreview("");
      setFormErrors({});
      pushToast("Media added.", "success");
    } catch (err) {
      pushToast("Failed to save.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = media.filter((m) =>
    [m.title, m.category]
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
            Media Gallery
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
            placeholder="Search media…"
            style={{ width: "200px", borderRadius: "30px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => {
              setShowForm(true);
              setFormErrors({});
              setFilePreview("");
            }}
          >
            <i className="bi bi-plus-lg me-2"></i> Add
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-images fs-1 text-muted"></i>
          <p className="text-muted mt-3">
            {searchTerm ? "No matches." : "No media items yet."}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((m) => (
            <div key={m._id} className="col-md-3 col-6">
              <div className="card border-0 shadow-sm h-100">
                {m.url?.includes("data:video") || m.url?.endsWith(".mp4") ? (
                  <video
                    src={m.url}
                    style={{ height: "140px", objectFit: "cover" }}
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={m.url || "https://via.placeholder.com/300x140"}
                    className="card-img-top"
                    style={{ height: "140px", objectFit: "cover" }}
                    alt={m.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x140";
                    }}
                  />
                )}
                <div className="p-2">
                  <small className="fw-bold d-block text-truncate">
                    {m.title}
                  </small>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="btn btn-sm btn-outline-danger w-100 mt-1"
                  >
                    Remove
                  </button>
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
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setFormErrors({});
              setFilePreview("");
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg p-3">
              <div className="modal-header border-0">
                <h5 className="fw-bold">Add Media</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowForm(false);
                    setFormErrors({});
                    setFilePreview("");
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
                    <div className="invalid-feedback">Required</div>
                  )}

                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <select
                        className="form-select"
                        value={formData.type}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            type: e.target.value,
                            url: "",
                          });
                          setFilePreview("");
                        }}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Date (e.g. June 2026)"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />

                  <div className="mb-2">
                    <label className="form-label small fw-bold">File *</label>
                    <input
                      type="file"
                      className={`form-control ${formErrors.url ? "is-invalid" : ""}`}
                      accept={formData.type === "image" ? "image/*" : "video/*"}
                      onChange={handleFileChange}
                    />
                    <small className="text-muted">Max 15MB</small>
                    {formErrors.url && (
                      <div className="invalid-feedback">Required</div>
                    )}
                    {filePreview && (
                      <div className="mt-1">
                        {formData.type === "image" ? (
                          <img
                            src={filePreview}
                            alt="Preview"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <video
                            src={filePreview}
                            style={{
                              width: "120px",
                              maxHeight: "80px",
                              borderRadius: "4px",
                            }}
                            controls
                            muted
                          />
                        )}
                        <button
                          type="button"
                          className="btn btn-sm text-danger ms-2"
                          onClick={() => {
                            setFilePreview("");
                            setFormData({ ...formData, url: "" });
                          }}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.description ? "is-invalid" : ""}`}
                    placeholder="Description *"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  {formErrors.description && (
                    <div className="invalid-feedback">Required</div>
                  )}

                  <button
                    className="btn btn-primary w-100"
                    disabled={submitting}
                  >
                    {submitting && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}
                    Upload Media
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

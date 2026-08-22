import React, { useState, useEffect } from "react";
import { api, endpoints } from "../../services/api";
import { Spinner } from "../../components/common/Spinner";

export function Teachers({ pushToast }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dept: "",
    qualification: "",
    experience: "",
    email: "",
    url: "",
    bio: "",
    office: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(endpoints.faculty);
      setTeachers(res.data || []);
    } catch (err) {
      setError("Failed to load faculty data");
      console.error(err);
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      pushToast("Image size should be less than 5MB.", "error");
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      pushToast("Please upload an image file.", "error");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, url: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this faculty member?")) return;
    try {
      await api.delete(`${endpoints.faculty}/${id}`);
      setTeachers(teachers.filter((t) => t._id !== id));
      pushToast("Faculty member removed.", "success");
    } catch (err) {
      pushToast("Failed to remove.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name) errors.name = "Required";
    if (!formData.dept) errors.dept = "Required";
    if (!formData.qualification) errors.qualification = "Required";
    if (!formData.experience) errors.experience = "Required";
    if (!formData.email) errors.email = "Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        url:
          formData.url ||
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
        bio: formData.bio || "Dedicated educator.",
        office: formData.office || "Main Block",
      };
      const res = await api.post(endpoints.faculty, payload);
      setTeachers([res.data, ...teachers]);
      setShowForm(false);
      setFormData({
        name: "",
        dept: "",
        qualification: "",
        experience: "",
        email: "",
        url: "",
        bio: "",
        office: "",
      });
      setImageFile(null);
      setImagePreview("");
      pushToast("Faculty member added.", "success");
    } catch (err) {
      pushToast("Failed to save.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = teachers.filter((t) =>
    [t.name, t.dept, t.email]
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
            Faculty Management
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
            placeholder="Search faculty…"
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
            {searchTerm ? "No matches." : "No faculty yet. Click + Add."}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((t) => (
            <div key={t._id} className="col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={
                      t.url ||
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
                    }
                    width="52"
                    height="52"
                    className="rounded-circle object-fit-cover"
                    alt={t.name}
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52'%3E%3Crect width='52' height='52' fill='%236c757d'/%3E%3Ctext x='26' y='30' font-size='20' text-anchor='middle' fill='white' font-family='Arial'%3E👤%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="fw-bold mb-0 text-truncate">{t.name}</h6>
                    <small className="text-primary fw-500">{t.dept}</small>
                  </div>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="btn btn-sm text-danger"
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Form Modal */}
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
                <h5 className="fw-bold">Add Faculty Member</h5>
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
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                        placeholder="Name *"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">Required</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${formErrors.dept ? "is-invalid" : ""}`}
                        placeholder="Department *"
                        value={formData.dept}
                        onChange={(e) =>
                          setFormData({ ...formData, dept: e.target.value })
                        }
                      />
                      {formErrors.dept && (
                        <div className="invalid-feedback">Required</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${formErrors.qualification ? "is-invalid" : ""}`}
                        placeholder="Qualification *"
                        value={formData.qualification}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qualification: e.target.value,
                          })
                        }
                      />
                      {formErrors.qualification && (
                        <div className="invalid-feedback">Required</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${formErrors.experience ? "is-invalid" : ""}`}
                        placeholder="Experience *"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                      />
                      {formErrors.experience && (
                        <div className="invalid-feedback">Required</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                        placeholder="Email *"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">Required</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <label className="form-label small fw-bold">
                          Profile Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <small className="text-muted">
                          Max 5MB. JPG, PNG, GIF
                        </small>
                      </div>
                      {imagePreview && (
                        <div className="mt-1">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="rounded-circle"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm text-danger ms-2"
                            onClick={() => {
                              setImagePreview("");
                              setImageFile(null);
                              setFormData({ ...formData, url: "" });
                            }}
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Bio (optional)"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Office (optional)"
                        value={formData.office}
                        onChange={(e) =>
                          setFormData({ ...formData, office: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    disabled={submitting}
                  >
                    {submitting && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}
                    Save Faculty
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

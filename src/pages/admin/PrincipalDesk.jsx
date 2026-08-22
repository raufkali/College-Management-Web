import React, { useState, useEffect } from "react";
import { api, endpoints } from "../../services/api";
import { Spinner } from "../../components/common/Spinner";

// ✅ Image compression helper
const compressImage = (
  file,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.7,
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export function PrincipalDesk({ pushToast, onClose }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    message: "",
    vision: "",
    mission: "",
    photo: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.principal);
      setFormData(res.data || {});
      if (res.data?.photo) {
        setImagePreview(res.data.photo);
      }
    } catch (err) {
      pushToast("Failed to load principal data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Check file size (5MB max)
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

    try {
      // ✅ Compress image before upload
      const compressedImage = await compressImage(file, 400, 400, 0.7);
      setImagePreview(compressedImage);
      setFormData({ ...formData, photo: compressedImage });
    } catch (err) {
      pushToast("Failed to process image.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.message) errors.message = "Required";
    if (!formData.vision) errors.vision = "Required";
    if (!formData.mission) errors.mission = "Required";
    if (!formData.photo) errors.photo = "Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await api.post(endpoints.principal, formData);
      pushToast("Principal desk updated.", "success");
      onClose();
    } catch (err) {
      if (err.response?.status === 413) {
        pushToast("Image too large. Please compress it further.", "error");
      } else {
        pushToast("Failed to update.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Principal Name"
        value={formData.name || ""}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Qualifications"
        value={formData.qualification || ""}
        onChange={(e) =>
          setFormData({ ...formData, qualification: e.target.value })
        }
      />

      <div className="mb-2">
        <label className="form-label small fw-bold">Principal Photo</label>
        <input
          type="file"
          className={`form-control ${formErrors.photo ? "is-invalid" : ""}`}
          accept="image/*"
          onChange={handleImageChange}
        />
        <small className="text-muted">
          Max 5MB. Will be compressed automatically
        </small>
        {formErrors.photo && (
          <div className="invalid-feedback">Photo is required</div>
        )}
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Principal"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <button
              type="button"
              className="btn btn-sm text-danger ms-2"
              onClick={() => {
                setImagePreview("");
                setFormData({ ...formData, photo: "" });
              }}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        )}
      </div>

      <textarea
        className={`form-control mb-2 ${formErrors.message ? "is-invalid" : ""}`}
        rows="2"
        placeholder="Welcome Message *"
        value={formData.message || ""}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      {formErrors.message && <div className="invalid-feedback">Required</div>}

      <textarea
        className={`form-control mb-2 ${formErrors.vision ? "is-invalid" : ""}`}
        rows="2"
        placeholder="Vision *"
        value={formData.vision || ""}
        onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
      />
      {formErrors.vision && <div className="invalid-feedback">Required</div>}

      <textarea
        className={`form-control mb-2 ${formErrors.mission ? "is-invalid" : ""}`}
        rows="2"
        placeholder="Mission *"
        value={formData.mission || ""}
        onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
      />
      {formErrors.mission && <div className="invalid-feedback">Required</div>}

      <button className="btn btn-primary w-100" disabled={submitting}>
        {submitting && (
          <span className="spinner-border spinner-border-sm me-2" />
        )}
        Save Settings
      </button>
    </form>
  );
}

export function ConfirmDialog({ config, onCancel, onConfirm }) {
  if (!config) return null;
  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1090 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-body p-4">
            <h6 className="fw-bold mb-2">{config.title}</h6>
            <p className="text-muted small mb-4">{config.message}</p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light btn-sm px-3" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm px-3"
                onClick={onConfirm}
                disabled={config.busy}
              >
                {config.busy ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

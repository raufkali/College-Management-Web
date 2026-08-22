export function AddDrawer({ open, title, onClose, children }) {
  return (
    <div
      className={`modal d-block ${open ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1075,
        display: open ? "block" : "none",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 p-3">
          <div className="modal-header border-0">
            <h5 className="fw-bold" style={{ color: "#0f1a3a" }}>
              {title}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

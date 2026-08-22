export function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1080, maxWidth: "360px" }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center text-white border-0 mb-2 bg-${t.variant === "error" ? "danger" : t.variant === "info" ? "info" : "success"}`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{t.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => onDismiss(t.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = "sm", color = "#7c3aed" }) {
  return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: color }} role="status" />
      <p className="text-muted mt-3">Loading…</p>
    </div>
  );
}

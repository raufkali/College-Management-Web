import { useState, useCallback } from "react";

let toastId = 0;

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, variant = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, pushToast, dismissToast };
}

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
type ToastListener = (msg: ToastMessage) => void;
const listeners: Set<ToastListener> = new Set();

export function toast(text: string, type: ToastMessage["type"] = "success") {
  const msg: ToastMessage = { id: ++toastId, text, type };
  listeners.forEach((l) => l(msg));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler: ToastListener = (msg) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 3000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const colors: Record<ToastMessage["type"], string> = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-indigo-600",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${colors[t.type]} text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg animate-fade-in`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

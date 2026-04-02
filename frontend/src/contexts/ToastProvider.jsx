import React, { useEffect, useRef, useState } from "react";
import { subscribeToToasts, dismissToast } from "../utils/toast";

const variantStyles = {
  success: {
    container: "bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 text-white border-green-200/40",
    icon: "bg-white/20 text-white",
  },
  error: {
    container: "bg-gradient-to-r from-rose-500 via-rose-400 to-red-500 text-white border-red-200/40",
    icon: "bg-white/20 text-white",
  },
  info: {
    container: "bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 text-white border-blue-200/40",
    icon: "bg-white/20 text-white",
  },
  warning: {
    container: "bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500 text-slate-900 border-amber-200/40",
    icon: "bg-white/30 text-slate-900",
  },
};

const variantIcons = {
  success: "✓",
  error: "⚠",
  info: "ℹ",
  warning: "!",
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  useEffect(() => {
    const unsubscribe = subscribeToToasts((event) => {
      if (event.type === "add") {
        setToasts((prev) => [...prev, event.toast]);
        const timer = setTimeout(() => dismissToast(event.toast.id), event.toast.duration);
        timers.current.set(event.toast.id, timer);
      }

      if (event.type === "remove") {
        setToasts((prev) => prev.filter((toast) => toast.id !== event.id));
        const timer = timers.current.get(event.id);
        if (timer) {
          clearTimeout(timer);
          timers.current.delete(event.id);
        }
      }
    });

    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
      unsubscribe();
    };
  }, []);

  const renderToast = (toast) => {
    const variant = variantStyles[toast.variant] || variantStyles.info;
    const icon = variantIcons[toast.variant] || variantIcons.info;

    return (
      <div
        key={toast.id}
        className={`pointer-events-auto w-full sm:w-96 rounded-2xl border shadow-2xl px-5 py-4 flex items-start gap-4 backdrop-blur-lg transition-all duration-200 hover:-translate-y-0.5 ${variant.container}`}
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${variant.icon}`}>
          {icon}
        </div>
        <div className="flex-1">
          {toast.title && <p className="font-semibold text-base mb-1">{toast.title}</p>}
          <p className="text-sm leading-snug opacity-90">{toast.message}</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => dismissToast(toast.id)}
          className="text-xl font-bold opacity-80 hover:opacity-100"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <>
      {children}
      <div className="fixed inset-x-4 bottom-5 flex flex-col gap-4 pointer-events-none sm:inset-auto sm:top-6 sm:right-6 sm:bottom-auto sm:w-[390px] z-[9999]">
        {toasts.map((toast) => renderToast(toast))}
      </div>
    </>
  );
};

export default ToastProvider;

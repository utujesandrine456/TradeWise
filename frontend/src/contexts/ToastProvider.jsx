import React, { useEffect, useRef, useState } from "react";
import { subscribeToToasts, dismissToast } from "../utils/toast";

const variantStyles = {
  success: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.2)",
    iconBg: "rgba(255,255,255,0.2)",
  },
  error: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.2)",
    iconBg: "rgba(255,255,255,0.2)",
  },
  info: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.2)",
    iconBg: "rgba(255,255,255,0.2)",
  },
  warning: {
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "#1c1917",
    border: "1px solid rgba(255,255,255,0.2)",
    iconBg: "rgba(255,255,255,0.3)",
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

    const currentTimers = timers.current;
    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer));
      currentTimers.clear();
      unsubscribe();
    };
  }, []);

  const renderToast = (toastItem) => {
    const variant = variantStyles[toastItem.variant] || variantStyles.info;
    const icon = variantIcons[toastItem.variant] || variantIcons.info;

    return (
      <div
        key={toastItem.id}
        style={{
          background: variant.background,
          color: variant.color,
          border: variant.border,
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          fontFamily: "'Urbanist', sans-serif",
          backdropFilter: "blur(8px)",
          transition: "transform 0.2s ease",
          width: "100%",
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <div
          style={{
            width: "2.2rem",
            height: "2.2rem",
            borderRadius: "50%",
            background: variant.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "1.1rem",
            fontWeight: "700",
            color: variant.color,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          {toastItem.title && (
            <p style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
              {toastItem.title}
            </p>
          )}
          <p style={{ fontSize: "0.875rem", opacity: 0.92, lineHeight: 1.4, fontWeight: "500" }}>
            {toastItem.message}
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => dismissToast(toastItem.id)}
          style={{
            fontSize: "1.4rem",
            fontWeight: "700",
            opacity: 0.75,
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            lineHeight: 1,
            padding: "0 0.2rem",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <>
      {children}
      <div
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          zIndex: 9999,
          width: "360px",
          maxWidth: "calc(100vw - 2rem)",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toastItem) => renderToast(toastItem))}
      </div>
    </>
  );
};

export default ToastProvider;

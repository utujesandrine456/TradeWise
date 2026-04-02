const listeners = new Set();
let nextId = 0;

const emit = (event) => {
  listeners.forEach((listener) => listener(event));
};

export const subscribeToToasts = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const pushToast = (variant, message, options = {}) => {
  if (!message) return null;
  const toast = {
    id: ++nextId,
    variant,
    message,
    title: options.title,
    duration: options.duration ?? 4000,
  };
  emit({ type: 'add', toast });
  return toast.id;
};

export const toast = {
  success: (message, options) => pushToast('success', message, options),
  error: (message, options) => pushToast('error', message, options),
  info: (message, options) => pushToast('info', message, options),
  warning: (message, options) => pushToast('warning', message, options),
};

export const dismissToast = (id) => {
  emit({ type: 'remove', id });
};

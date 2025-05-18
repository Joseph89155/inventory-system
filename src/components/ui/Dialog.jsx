// src/components/ui/Dialog.jsx
import React, { useEffect } from "react";

// Base wrapper
export function Dialog({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-lg mx-4 p-6 shadow-xl relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Dialog sections
export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{children}</p>;
}

export function DialogContent({ children }) {
  return <div className="space-y-4">{children}</div>;
}

export function DialogFooter({ children }) {
  return <div className="mt-6 flex justify-end space-x-2">{children}</div>;
}

export default Dialog;

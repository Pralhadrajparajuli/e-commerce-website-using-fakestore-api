import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const showToast = (text, toastType = "success") => {
    setMessage(text);
    setType(toastType);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Message - Bottom Right */}
      {message && (
            <div
      className={`fixed top-6 right-6 z-[100] rounded-lg px-6 py-3 text-white shadow-lg ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-gray-800"
      }`}
    >
      {message}
    </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { WishlistProvider } from "./WishlistContext";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./ToastContext";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
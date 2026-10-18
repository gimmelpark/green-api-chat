import { logout } from "@/common/logout";
import { initViewportSize } from "@/common/viewport";
import { useAuthStore } from "@/store/authStore";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

initViewportSize();

await useAuthStore.getState().initialAuthCheck().catch(logout);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

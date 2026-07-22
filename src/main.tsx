import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.tsx";
import { applyTheme, useStore } from "./state/store.ts";
import "./styles/tokens.css";
import "./styles/base.css";

// Apply the persisted / OS-preferred theme before first paint.
applyTheme(useStore.getState().theme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

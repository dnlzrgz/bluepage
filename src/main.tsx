import { StrictMode } from "react";
import { flushSync } from "react-dom";
import ReactDOM from "react-dom/client";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import App from "./App";
import { initSettings } from "./lib/settings";

async function revealWindow() {
  if (!isTauri()) return;

  try {
    const win = getCurrentWindow();
    await win.show();
    await win.setFocus();
  } catch (error) {
    console.error("Failed to show window", error);
  }
}

async function boot() {
  await initSettings();

  const root = ReactDOM.createRoot(document.getElementById("app")!);

  flushSync(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });

  await revealWindow();
}

void boot();

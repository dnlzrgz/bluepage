import { StrictMode } from "react";
import { flushSync } from "react-dom";
import ReactDOM from "react-dom/client";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import "./App.css";
import App from "./App";
import { initSettings } from "./lib/settings";

async function revealMainWindow() {
  if (!isTauri()) return;

  try {
    const main = getCurrentWindow();
    await main.show();
    await main.setFocus();
    await (await WebviewWindow.getByLabel("splashscreen"))?.close();
  } catch (error) {
    console.error("Failed to reveal main window", error);
  }
}

async function boot() {
  const MIN_SPLASH_MS = 500;
  const startedAt = performance.now();

  try {
    await initSettings();
  } finally {
    const root = ReactDOM.createRoot(document.getElementById("app")!);
    flushSync(() => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });

    const remaining = MIN_SPLASH_MS - (performance.now() - startedAt);
    if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

    await revealMainWindow();
  }
}

void boot();

import { StrictMode } from "react";
import { flushSync } from "react-dom";
import ReactDOM from "react-dom/client";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import "./styles/index.css";
import App from "./App";
import { initSettings } from "./lib/settings";
import { ensureMarkdownStorage } from "./lib/markdown";

async function showMainWindow() {
  if (!isTauri()) return;

  try {
    const main = getCurrentWindow();
    await main.show();
    await main.setFocus();
    await (await WebviewWindow.getByLabel("splashscreen"))?.close();
  } catch (error) {
    console.error("Failed to show main window", error);
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

    await showMainWindow();
  }

  // After the window: the first render stays one settings read.
  void ensureMarkdownStorage();
}

void boot();

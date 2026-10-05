import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import { initSettings } from "./lib/settings";

async function boot() {
  await initSettings();

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void boot();

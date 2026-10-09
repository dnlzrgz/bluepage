import { LazyStore } from "@tauri-apps/plugin-store";
import { create } from "zustand";

export const THEMES = ["blue", "forest", "plum", "clay", "paper"] as const;
export type Theme = (typeof THEMES)[number];

interface Settings {
  theme: Theme;
}

const DEFAULTS: Settings = { theme: "blue" };
const store = new LazyStore("settings.json");

export const useSettings = create<Settings>(() => DEFAULTS);

function applySettings({ theme }: Settings) {
  const root = document.documentElement;
  root.dataset.theme = theme;
}

export async function initSettings() {
  try {
    const theme = await store.get<Theme>("theme");

    useSettings.setState({
      theme: theme && THEMES.includes(theme) ? theme : DEFAULTS.theme,
    });
  } catch (error) {
    console.error("Failed to load settings", error);
  }

  applySettings(useSettings.getState());
}

export async function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  useSettings.setState({ [key]: value } as Pick<Settings, K>);
  applySettings(useSettings.getState());

  try {
    await store.set(key, value);
  } catch (error) {
    console.error("Failed to save setting", key, error);
  }
}

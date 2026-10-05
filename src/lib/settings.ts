import { LazyStore } from "@tauri-apps/plugin-store";
import { create } from "zustand";

export const THEMES = ["blue", "forest", "plum"] as const;
export type Theme = (typeof THEMES)[number];

interface Settings {
  theme: Theme;
  font: string | null; // null = system font
}

const DEFAULTS: Settings = { theme: "blue", font: null };
const store = new LazyStore("settings.json");

export const useSettings = create<Settings>(() => DEFAULTS);

function applySettings({ theme, font }: Settings) {
  const root = document.documentElement;
  root.dataset.theme = theme;

  if (font) {
    root.style.setProperty("--app-font", font);
  } else {
    root.style.removeProperty("--app-font");
  }
}

export async function initSettings() {
  try {
    const [theme, font] = await Promise.all([
      store.get<Theme>("theme"),
      store.get<string | null>("font"),
    ]);

    useSettings.setState({
      theme: theme && THEMES.includes(theme) ? theme : DEFAULTS.theme,
      font: font ?? DEFAULTS.font,
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

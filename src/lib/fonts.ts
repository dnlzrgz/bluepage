import { getSystemFonts } from "tauri-plugin-system-fonts-api";

const collator = new Intl.Collator(undefined, { sensitivity: "base" });

let cached: string[] | null = null;
let pending: Promise<string[]> | null = null;

export const getCachedFonts = () => cached;

export async function loadFonts(): Promise<string[]> {
  if (cached) return Promise.resolve(cached);
  pending ??= getSystemFonts()
    .then((list) => (cached = [...new Set(list.map((f) => f.name))].sort(collator.compare)))
    .finally(() => {
      pending = null;
    });

  return pending;
}

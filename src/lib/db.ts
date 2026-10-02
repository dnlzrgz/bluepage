import { invoke } from "@tauri-apps/api/core";

export interface Entry {
  id: number;
  date: string; // ISO 8601 date (YYYY-MM-DD)
  content: string; // TipTap JSON, serialized
  plain_text: string; // Extracted plain text for FTS
  created_at: string;
  updated_at: string;
}

export async function loadEntry(date: string): Promise<Entry | null> {
  return invoke<Entry | null>("load_entry", { date });
}

export async function upsertEntry(date: string, content: string, plainText: string): Promise<void> {
  await invoke("upsert_entry", { date, content, plainText });
}

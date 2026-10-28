import { type JSONContent } from "@tiptap/core";
import { Markdown, MarkdownManager } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { readLegacyEntries, upsertEntry } from "@/lib/db";
import { track } from "@/stores/status";

export const EXTENSIONS = [
  StarterKit.configure({
    codeBlock: false,
    horizontalRule: false,
    dropcursor: false,
    gapcursor: false,
  }),

  Markdown,
];

const manager = new MarkdownManager({ extensions: EXTENSIONS });

function isLegacy(content: string): boolean {
  return content.trimStart().startsWith('{"type":"doc"');
}

export function entryDoc(content: string): JSONContent | string {
  if (!isLegacy(content)) return manager.parse(content);

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read legacy entry", error);
    return manager.parse(content);
  }
}

let conversion: Promise<void> | null = null;

export function ensureMarkdownStorage(): Promise<void> {
  if (!conversion) {
    conversion = track(convertLegacyEntries()).catch((error) => {
      console.error("Failed to convert entries to markdown", error);
      conversion = null;
    });
  }

  return conversion;
}

async function convertLegacyEntries(): Promise<void> {
  for (const row of await track(readLegacyEntries())) {
    let markdown: string;
    try {
      markdown = manager.serialize(JSON.parse(row.content));
    } catch (error) {
      console.error("Failed to convert entry to markdown", row.date, error);
      continue;
    }

    await track(upsertEntry(row.date, markdown, row.plain_text));
  }
}

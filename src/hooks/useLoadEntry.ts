import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { loadEntry } from "@/lib/db";
import { track } from "@/stores/status";

export function useLoadEntry(editor: Editor | null, isoDate: string): boolean {
  const [failedDate, setFailedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;

    (async () => {
      try {
        const entry = await track(loadEntry(isoDate));
        if (cancelled) return;

        editor
          .chain()
          .setContent(entry?.content ? JSON.parse(entry.content) : "", {
            emitUpdate: false,
          })
          .setMeta("addToHistory", false)
          .run();

        editor.setEditable(true, false);
      } catch (error) {
        console.error("Failed to load entry", isoDate, error);
        if (!cancelled) setFailedDate(isoDate);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editor, isoDate]);

  return failedDate === isoDate;
}

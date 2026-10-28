import { useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { getEntry } from "@/lib/db";
import { entryDoc } from "@/lib/markdown";
import { track } from "@/stores/status";

export function useLoadEntry(editor: Editor | null, isoDate: string): void {
  useEffect(() => {
    if (!editor) return;
    let cancelled = false;

    (async () => {
      try {
        const entry = await track(getEntry(isoDate));
        if (cancelled) return;

        editor
          .chain()
          .setContent(entryDoc(entry?.content ?? ""), { emitUpdate: false })
          .setMeta("addToHistory", false)
          .run();

        editor.setEditable(true, false);
      } catch (error) {
        console.error("Failed to load entry", isoDate, error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editor, isoDate]);
}

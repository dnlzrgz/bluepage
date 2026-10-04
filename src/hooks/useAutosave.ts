import { useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { createAutosaver } from "@/lib/autosave";
import { upsertEntry } from "@/lib/db";

export function useAutosave(editor: Editor | null, isoDate: string) {
  useEffect(() => {
    if (!editor) return;

    const saver = createAutosaver({
      snapshot: () => ({
        content: JSON.stringify(editor.getJSON()),
        text: editor.getText(),
      }),
      write: ({ content, text }) => upsertEntry(isoDate, content, text),
    });

    editor.on("update", saver.schedule);
    const unlisten = getCurrentWindow().onCloseRequested(() => saver.flush());

    return () => {
      editor.off("update", saver.schedule);
      void saver.flush();
      void unlisten.then((fn) => fn());
    };
  }, [editor, isoDate]);
}

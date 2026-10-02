import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDate } from "@/stores/journal";
import { toISODate } from "@/lib/date";
import { useEffect } from "react";
import { loadEntry, upsertEntry } from "@/lib/db";
import { track } from "@/stores/status";

const Editor = () => {
  const isoDate = toISODate(useDate());

  const editor = useEditor(
    {
      extensions: [StarterKit],
      editorProps: {
        attributes: {
          class:
            "mx-auto mt-12 w-full max-w-255 min-h-[50vh] px-12 py-8 bg-primary prose prose-neutral prose-lg text-white antialiased prose-p:font-light prose-li:font-light focus:outline-none",
        },
      },
      onUpdate: ({ editor }) => {
        void track(upsertEntry(isoDate, JSON.stringify(editor.getJSON()), editor.getText()));
      },
    },
    [isoDate],
  );

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;

    loadEntry(isoDate).then((entry) => {
      if (cancelled) return;
      editor.commands.setContent(entry ? JSON.parse(entry.content) : "", {
        emitUpdate: false,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [editor, isoDate]);

  return <EditorContent editor={editor} />;
};

export default Editor;

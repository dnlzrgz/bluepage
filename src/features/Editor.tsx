import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDate } from "@/stores/journal";
import { toISODate } from "@/lib/date";
import { useEffect } from "react";
import { loadEntry, upsertEntry } from "@/lib/db";
import { track } from "@/stores/status";

const EDITOR_CLASS = [
  "prose prose-lg",
  "mx-auto w-full max-w-255",
  "px-6 pt-12 pb-[50dvh]",
  "antialiased hyphens-auto wrap-break-word",
  "bg-primary focus:outline-none",
].join(" ");

const Editor = () => {
  const isoDate = toISODate(useDate());

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          horizontalRule: false,
          dropcursor: false,
          gapcursor: false,
        }),
      ],
      editorProps: {
        attributes: {
          class: EDITOR_CLASS,
        },
        scrollThreshold: { top: 0, bottom: 200, left: 0, right: 0 },
        scrollMargin: { top: 0, bottom: 200, left: 0, right: 0 },
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

import { useEffect } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffectiveDate, toISODate } from "@/stores/journal";
import { track } from "@/stores/status";
import { loadEntry, upsertEntry } from "@/lib/db";

function parseContent(raw: string): JSONContent | "" {
  try {
    return JSON.parse(raw) as JSONContent;
  } catch (error) {
    console.error("Failed to parse entry content", error);
    return "";
  }
}

const EDITOR_CLASS = [
  "prose prose-lg",
  "mx-auto w-full max-w-255",
  "px-6 pt-12 pb-[50dvh]",
  "antialiased hyphens-auto wrap-break-word",
  "bg-primary focus:outline-none",
].join(" ");

const Editor = () => {
  const isoDate = toISODate(useEffectiveDate());

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
        track(
          upsertEntry(
            isoDate,
            JSON.stringify(editor.getJSON()),
            editor.getText(),
          ),
        ).catch((error) => console.error("Failed to save entry", error));
      },
    },
    [isoDate],
  );

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;

    editor.setEditable(false, false);

    const load = async () => {
      let content: string | JSONContent = "";
      try {
        const entry = await track(loadEntry(isoDate));
        if (entry) content = parseContent(entry.content);
      } catch (error) {
        console.error("Failed to load entry", error);
      }

      if (cancelled) return;
      editor.commands.setContent(content, { emitUpdate: false });
      editor.setEditable(true, false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [editor, isoDate]);

  return <EditorContent editor={editor} />;
};

export default Editor;

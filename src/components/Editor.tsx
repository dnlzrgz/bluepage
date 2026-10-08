import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffectiveDate } from "@/stores/journal";
import { useLoadEntry } from "@/hooks/useLoadEntry";
import { useAutosave } from "@/hooks/useAutosave";

const EXTENSIONS = [
  StarterKit.configure({
    codeBlock: false,
    horizontalRule: false,
    dropcursor: false,
    gapcursor: false,
  }),
];

const EDITOR_PROPS = {
  attributes: {
    spellcheck: "true",
    lang: navigator.language,
    class: [
      "prose prose-lg",
      "mx-auto w-full max-w-255",
      "px-6 pt-12 mt-6 pb-[50dvh]",
      "antialiased hyphens-auto wrap-break-word",
      "bg-background focus:outline-none",
    ].join(" "),
  },
  scrollThreshold: { top: 0, bottom: 200, left: 0, right: 0 },
  scrollMargin: { top: 0, bottom: 200, left: 0, right: 0 },
};

export function Editor() {
  const isoDate = useEffectiveDate();

  const editor = useEditor({ extensions: EXTENSIONS, editable: false, editorProps: EDITOR_PROPS }, [
    isoDate,
  ]);

  const loadFailed = useLoadEntry(editor, isoDate);
  useAutosave(editor, isoDate);

  if (loadFailed) {
    return (
      <p role="alert" className="mx-auto max-w-255 px-6 pt-12 text-lg text-foreground">
        Something went wrong :(
      </p>
    );
  }

  return <EditorContent editor={editor} />;
}

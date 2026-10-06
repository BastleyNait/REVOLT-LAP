"use client";

import { useEffect, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { toEditorHtml } from "@/lib/rich-text/format";
import { cn } from "@/lib/utils/cn";

/**
 * WYSIWYG editor for product descriptions. Emits HTML through `onChange`; the
 * server sanitizes it on save, so the allowed formatting mirrors the
 * sanitizer allow-list (headings, lists, emphasis, quotes and links).
 */
export function RichTextEditor({
  id,
  label,
  value,
  onChange,
  placeholder,
  invalid,
  describedBy,
}: {
  id: string;
  /** Accessible name (a <label for> cannot target a contenteditable). */
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: toEditorHtml(value),
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-label": label,
        "aria-multiline": "true",
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
        ...(invalid ? { "aria-invalid": "true" } : {}),
        class: "rich-text min-h-[200px] px-4 py-3 text-on-surface focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  // Sync external resets (e.g. values echoed back after a validation error).
  useEffect(() => {
    if (!editor) return;
    const next = toEditorHtml(value);
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (next !== current) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-surface-container-lowest/70 transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/40",
        invalid ? "border-error" : "border-outline-variant",
      )}
    >
      <Toolbar editor={editor} />
      <div className="relative">
        {editor?.isEmpty && placeholder ? (
          <p aria-hidden className="pointer-events-none absolute left-4 top-3 text-on-surface-variant/60">
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  // Read from the `editor` prop rather than the snapshot: the snapshot only
  // picks up a newly created editor after its first transaction, which would
  // leave the toolbar hidden until the user clicks into the field.
  const state = useEditorState({
    editor,
    selector: () => {
      const e = editor;
      return e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            strike: e.isActive("strike"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null;
    },
  });

  if (!editor || !state) {
    return <div className="h-[49px] border-b border-outline-variant bg-surface-container/60" />;
  }

  const chain = () => editor.chain().focus();

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Pega el enlace (https://…)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "" || url.trim() === "https://") {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }
    chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div role="toolbar" aria-label="Formato de texto" className="flex flex-wrap items-center gap-0.5 border-b border-outline-variant bg-surface-container/60 p-1.5">
      <ToolButton label="Negrita (Ctrl+B)" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </ToolButton>
      <ToolButton label="Cursiva (Ctrl+I)" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </ToolButton>
      <ToolButton label="Subrayado (Ctrl+U)" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
        <Underline />
      </ToolButton>
      <ToolButton label="Tachado" active={state.strike} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough />
      </ToolButton>
      <Divider />
      <ToolButton label="Subtítulo" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 />
      </ToolButton>
      <ToolButton label="Subtítulo pequeño" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        <Heading3 />
      </ToolButton>
      <Divider />
      <ToolButton label="Lista con viñetas" active={state.bullet} onClick={() => chain().toggleBulletList().run()}>
        <List />
      </ToolButton>
      <ToolButton label="Lista numerada" active={state.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered />
      </ToolButton>
      <ToolButton label="Cita destacada" active={state.quote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote />
      </ToolButton>
      <Divider />
      <ToolButton label="Insertar enlace" active={state.link} onClick={setLink}>
        <LinkIcon />
      </ToolButton>
      {state.link ? (
        <ToolButton label="Quitar enlace" onClick={() => chain().extendMarkRange("link").unsetLink().run()}>
          <Unlink />
        </ToolButton>
      ) : null}
      <ToolButton label="Quitar formato" onClick={() => chain().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting />
      </ToolButton>
      <Divider />
      <ToolButton label="Deshacer (Ctrl+Z)" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 />
      </ToolButton>
      <ToolButton label="Rehacer (Ctrl+Y)" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 />
      </ToolButton>
    </div>
  );
}

function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors [&_svg]:size-[18px]",
        active ? "bg-primary/20 text-primary" : "hover:bg-white/10 hover:text-on-surface",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-6 w-px bg-outline-variant" />;
}

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo2, Redo2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const RichTextEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-shivraj max-w-none min-h-[300px] focus:outline-none p-4",
      },
    },
  });

  if (!editor) return null;

  const btn = "p-2 rounded hover:bg-shivraj-100 text-shivraj-800";
  const active = "bg-shivraj-200";

  const addLink = () => {
    const url = window.prompt("URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border rounded-md bg-white">
      <div className="flex flex-wrap gap-1 border-b p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive("bold") ? active : ""}`} aria-label="Bold"><Bold size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive("italic") ? active : ""}`} aria-label="Italic"><Italic size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`} aria-label="H2"><Heading2 size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`} aria-label="H3"><Heading3 size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive("bulletList") ? active : ""}`} aria-label="Bullet list"><List size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive("orderedList") ? active : ""}`} aria-label="Ordered list"><ListOrdered size={16} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive("blockquote") ? active : ""}`} aria-label="Quote"><Quote size={16} /></button>
        <button type="button" onClick={addLink} className={`${btn} ${editor.isActive("link") ? active : ""}`} aria-label="Link"><LinkIcon size={16} /></button>
        <button type="button" onClick={addImage} className={btn} aria-label="Image"><ImageIcon size={16} /></button>
        <div className="ml-auto flex gap-1">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn} aria-label="Undo"><Undo2 size={16} /></button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn} aria-label="Redo"><Redo2 size={16} /></button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

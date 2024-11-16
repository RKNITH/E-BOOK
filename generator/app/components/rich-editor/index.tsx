"use client";

import { FC, ReactNode, useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import clsx from "clsx";
import Tools from "./Tools";

interface Props {
  className?: string;
  value?: string;
  onChange?(html: string): void;
  editable?: boolean;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  placeholder?: string;
}

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ul",
      },
    },

    orderedList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ol",
      },
    },
  }),
];

let loaded = false;
const RichEditor: FC<Props> = ({
  editable,
  value,
  placeholder,
  isInvalid,
  errorMessage,
  className,
  onChange,
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [...extensions, Placeholder.configure({ placeholder })],
    onUpdate({ editor }) {
      onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (loaded && editable) return;

    if (editor && !editable) {
      editor.setEditable(false);
    }

    if (editor && value) {
      editor.commands.setContent(value);
      // loaded = true;
    }
  }, [editor, value, editable]);

  useEffect(() => {
    return () => {
      loaded = false;
    };
  }, []);

  return (
    <div
      className={clsx(
        isInvalid && "ring-2 ring-red-400 p-2 rounded-medium min-w-full"
      )}
    >
      <Tools editor={editor} visible={editable} />
      <EditorContent editor={editor} className={className} />

      {errorMessage}
    </div>
  );
};

export default RichEditor;

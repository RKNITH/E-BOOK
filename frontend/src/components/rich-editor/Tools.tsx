import { FC } from "react";
import ToolButton from "./ToolButton";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListNumbered,
  MdList,
} from "react-icons/md";
import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
  visible?: boolean;
}

const Tools: FC<Props> = ({ editor, visible }) => {
  if (!visible) return null;

  return (
    <div className="flex items-center space-x-3 p-2">
      <ToolButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={editor?.isActive("bold")}
      >
        <MdFormatBold />
      </ToolButton>

      <ToolButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={editor?.isActive("italic")}
      >
        <MdFormatItalic />
      </ToolButton>

      <ToolButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive("bulletList")}
      >
        <MdList />
      </ToolButton>

      <ToolButton
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        isActive={editor?.isActive("orderedList")}
      >
        <MdFormatListNumbered />
      </ToolButton>
    </div>
  );
};

export default Tools;

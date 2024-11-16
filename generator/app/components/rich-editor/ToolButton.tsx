import clsx from "clsx";
import { FC, ReactNode } from "react";

interface Props {
  onClick?(): void;
  isActive?: boolean;
  children: ReactNode;
}

const ToolButton: FC<Props> = ({ children, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={clsx("p-1 rounded", isActive && "bg-black text-white")}
    >
      {children}
    </button>
  );
};

export default ToolButton;

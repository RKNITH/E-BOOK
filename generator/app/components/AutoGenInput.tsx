import { FC, InputHTMLAttributes } from "react";
import { MdAutoAwesome } from "react-icons/md";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onMagic?(): void;
}

export const AutoGenButton = ({ onMagic }: { onMagic?(): void }) => {
  return (
    <button
      type="button"
      className="w-10 flex items-center justify-center aspect-square"
      onClick={onMagic}
    >
      <MdAutoAwesome size={24} />
    </button>
  );
};

const AutoGenInput: FC<Props> = ({ onMagic, ...props }) => {
  return (
    <div className="transition-all flex items-center rounded-md shadow-md w-full space-x-2 p-2">
      <input
        {...props}
        className="p-3 w-full bg-transparent text-lg outline-none"
      />

      <AutoGenButton onMagic={onMagic} />
    </div>
  );
};

export default AutoGenInput;

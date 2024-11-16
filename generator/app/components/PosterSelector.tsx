import { FC, InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  src?: string;
  isInvalid?: boolean;
  fileName?: string;
  errorMessage?: ReactNode;
}

const PosterSelector: FC<Props> = ({
  fileName,
  errorMessage,
  isInvalid,
  src,
  ...props
}) => {
  return (
    <div>
      <label
        className={clsx(
          "cursor-pointer inline-block",
          isInvalid && "text-red-400"
        )}
        htmlFor={props.name}
      >
        <input {...props} type="file" id={props.name} hidden />

        <div
          className={clsx(
            "hover:bg-default-200 transition w-28 h-32 flex items-center justify-center rounded-md overflow-hidden cursor-pointer",
            isInvalid ? "ring-2 ring-red-400" : "bg-default-100"
          )}
        >
          {src ? (
            <img src={src} alt="poster" className="object-fill" />
          ) : (
            <p className="text-sm">Select Poster</p>
          )}
        </div>
        {fileName ? <p className="w-28 text-sm truncate">{fileName}</p> : null}
        {errorMessage}
      </label>
    </div>
  );
};

export default PosterSelector;

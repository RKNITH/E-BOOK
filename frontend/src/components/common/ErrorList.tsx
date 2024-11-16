import { FC } from "react";

interface Props {
  errors?: string[];
}

const ErrorList: FC<Props> = ({ errors }) => {
  if (!errors) return null;

  return (
    <div className="text-xs text-red-400 space-y-1">
      {errors.map((err) => {
        return <p key={err}>{err}</p>;
      })}
    </div>
  );
};

export default ErrorList;

import { Spinner } from "@nextui-org/react";
import { FC } from "react";

interface Props {
  label?: string;
}

const LoadingSpinner: FC<Props> = ({ label }) => {
  return (
    <div className="flex items-center justify-center p-10">
      <Spinner label={label} color="warning" />
    </div>
  );
};

export default LoadingSpinner;

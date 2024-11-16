import { Spinner } from "@nextui-org/react";
import clsx from "clsx";
import { FC } from "react";

interface Props {
  visible?: boolean;
}

const LoadingIndicator: FC<Props> = ({ visible }) => {
  return (
    <div
      className={clsx(
        visible ? "block" : "hidden",
        "fixed z-[100] inset-0 bg-white flex items-center justify-center"
      )}
    >
      <Spinner color="success" />
    </div>
  );
};

export default LoadingIndicator;

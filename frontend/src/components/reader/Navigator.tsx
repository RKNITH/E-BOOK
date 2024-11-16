import { Button } from "@nextui-org/react";
import clsx from "clsx";
import { FC, ReactNode } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface Props {
  side: "left" | "right";
  className?: string;
  onClick(): void;
}

const Navigator: FC<Props> = ({ side, className, onClick }) => {
  let icon: ReactNode = <></>;
  let classesBySide = "";

  if (side === "left") {
    icon = <FaAngleLeft />;
    classesBySide = "left-0 pl-5";
  }

  if (side === "right") {
    icon = <FaAngleRight />;
    classesBySide = "right-0 pr-5";
  }

  return (
    <div className={clsx("fixed top-1/2 transition", classesBySide, className)}>
      <Button
        radius="full"
        variant="bordered"
        isIconOnly
        className="dark:border-book-dark dark:text-book-dark"
        onClick={onClick}
      >
        {icon}
      </Button>
    </div>
  );
};

export default Navigator;

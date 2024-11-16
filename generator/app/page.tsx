import { FC } from "react";
import EpubGeneratorForm from "./components/EpubGeneratorForm";

interface Props {}

const page: FC<Props> = () => {
  return (
    <div className="max-w-5xl mx-auto p-5">
      <EpubGeneratorForm />
    </div>
  );
};

export default page;

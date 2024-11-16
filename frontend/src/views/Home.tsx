import { FC } from "react";
import HeroSection from "../components/HeroSection";
import BookByGenre from "../components/BookByGenre";

interface Props {}

const Home: FC<Props> = () => {
  return (
    <div className="space-y-10 px-5 lg:p-0">
      <HeroSection />
      <BookByGenre genre="Fiction" />
      <BookByGenre genre="Young Adult" />
      <BookByGenre genre="Science Fiction" />
    </div>
  );
};

export default Home;

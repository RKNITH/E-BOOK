import { Button } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import client from "../api/client";

interface Props {}
interface FeaturedBook {
  title: string;
  slogan: string;
  subtitle: string;
  cover: string;
  slug: string;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
};

const HeroSection: FC<Props> = () => {
  const [books, setBooks] = useState<FeaturedBook[]>([]);
  useEffect(() => {
    client<{ featuredBooks: FeaturedBook[] }>("/book/featured").then(
      ({ data }) => {
        setBooks(data.featuredBooks);
      }
    );
  }, []);

  return (
    <div className="md:h-96 rounded-medium p-5 bg-[#faf7f2] dark:bg-[#231e1a]">
      <Slider {...settings}>
        {books.map((item) => {
          return (
            <div key={item.slug}>
              <div className="md:flex justify-between">
                <div className="flex-1 flex flex-col justify-center p-5">
                  <h1 className="lg:text-6xl text-3xl">{item.slogan}</h1>
                  <p className="md:text-lg mt-3 italic">{item.subtitle}</p>
                  <div className="mt-3">
                    <Button
                      radius="sm"
                      color="danger"
                      variant="bordered"
                      endContent={<FaArrowRightLong />}
                      as={Link}
                      to={`/book/${item.slug}`}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex items-center justify-center">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="md:w-48 md:h-80 w-32 rounded-md object-cover shadow-lg rotate-12"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default HeroSection;

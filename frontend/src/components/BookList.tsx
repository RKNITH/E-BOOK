import { FC } from "react";
import { calculateDiscount, formatPrice } from "../utils/helper";
import { Chip } from "@nextui-org/react";
import DividerWithTitle from "./common/DividerWithTitle";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

export interface Book {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}

interface Props {
  data: Book[];
  title?: string;
}

const BookList: FC<Props> = ({ title, data }) => {
  return (
    <div>
      <DividerWithTitle title={title} />

      <div className="mt-6 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {data.map((book) => {
          return (
            <Link key={book.id} to={`/book/${book.slug}`}>
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-32 h-[185px] object-contain rounded"
                />

                <div className="w-full space-y-2">
                  <p className="font-bold line-clamp-2">{book.title}</p>

                  <Chip color="danger" radius="sm" size="sm">
                    {calculateDiscount(book.price)}% Off
                  </Chip>
                </div>

                <div className="w-full">
                  <div className="flex space-x-2">
                    <p className="font-bold">
                      {formatPrice(Number(book.price.sale))}
                    </p>
                    <p className="line-through">
                      {formatPrice(Number(book.price.mrp))}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  {book.rating ? (
                    <Chip radius="sm" color="warning" variant="solid">
                      <div className="flex items-center font-semibold text-sm space-x-1">
                        <span>{book.rating}</span> <FaStar />
                      </div>
                    </Chip>
                  ) : (
                    <span>No Ratings</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookList;

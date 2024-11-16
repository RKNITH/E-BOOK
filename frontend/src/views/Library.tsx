import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { parseError } from "../utils/helper";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";

interface Props {}

interface BookDetail {
  id: string;
  title: string;
  cover?: string;
  slug: string;
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

const Library: FC<Props> = () => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<BookDetail[]>([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const { data } = await client.get("/book/list");
        setBooks(data.books);
      } catch (error) {
        parseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchAllBooks();
  }, []);

  if (fetching)
    return (
      <div className="text-center pt-10 animate-pulse">
        <p>Loading...</p>
      </div>
    );

  if (!books.length)
    return (
      <div className="text-center pt-10 font-bold text-3xl opacity-60">
        <p>Oops, your library looks empty!</p>
      </div>
    );

  return (
    <div className="space-y-6 px-5 py-10">
      {books.map((book) => {
        return (
          <div className="flex" key={book.id}>
            <img src={book.cover} alt={book.title} className="w-36 rounded" />

            <div className="p-5 space-y-3">
              <h1 className="line-clamp-1 text-xl font-semibold">
                {book.title}
              </h1>

              <div className="flex items-center space-x-1">
                <span className="font-semibold">By </span>
                <Link
                  className="font-semibold hover:underline"
                  to={`/author/${book.author.id}`}
                >
                  {book.author.name}
                </Link>
              </div>

              <div>
                <Button
                  as={Link}
                  to={`/read/${book.slug}?title=${book.title}&id=${book.id}`}
                  radius="sm"
                >
                  Read Now
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Library;

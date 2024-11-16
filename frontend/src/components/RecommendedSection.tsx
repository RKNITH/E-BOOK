import { FC, useEffect, useState } from "react";
import client from "../api/client";
import { parseError } from "../utils/helper";
import Skeletons from "./skeletons";
import BookList, { Book } from "./BookList";

interface Props {
  id?: string;
}

const RecommendedSection: FC<Props> = ({ id }) => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchBooks = async () => {
      try {
        const { data } = await client.get("/book/recommended/" + id);
        setBooks(data);
      } catch (error) {
        parseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchBooks();
  }, [id]);

  if (!id) return null;

  if (fetching) return <Skeletons.BookList />;

  return (
    <div>
      <BookList data={books} title="Books related to this book" />
    </div>
  );
};

export default RecommendedSection;

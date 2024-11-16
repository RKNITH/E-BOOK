import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { parseError } from "../utils/helper";
import { Link, User } from "@nextui-org/react";
import RichEditor from "../components/rich-editor";
import BookList, { Book } from "../components/BookList";

interface Props {}

interface AuthorInfo {
  id: string;
  name: string;
  about: string;
  socialLinks: string[];
  books: Book[];
}

const AuthorPage: FC<Props> = () => {
  const [fetching, setFetching] = useState(true);
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo>();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchAuthorInfo = async () => {
      try {
        const { data } = await client.get(`/author/${id}`);
        setAuthorInfo(data);
      } catch (error) {
        parseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchAuthorInfo();
  }, [id]);

  if (fetching)
    return (
      <div className="text-center pt-10, animate-pulse">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="p-5 lg:p-0">
      <User name={authorInfo?.name} />

      <div className="py-6 pl-10">
        <h1 className="font-semibold text-lg">Social Links:</h1>
        <div className="flex items-center space-x-2">
          {authorInfo?.socialLinks.map((link) => {
            const { host } = new URL(link);
            return (
              <div key={link}>
                <Link
                  className="text-gray-800 dark:text-white font-semibold underline"
                  href={link}
                  target="_blank"
                >
                  {host}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pl-10 mt-3">
        <RichEditor value={authorInfo?.about} className="regular" />
      </div>

      <div className="mt-6">
        <BookList title="Books By The Author" data={authorInfo?.books || []} />
      </div>
    </div>
  );
};

export default AuthorPage;

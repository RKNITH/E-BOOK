import { Input } from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { IoMdSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Props {}

const SearchForm: FC<Props> = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    if (query.trim().length >= 3) navigate("/search?title=" + query);
    else toast.error("Invalid search query!");
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <Input
        variant="bordered"
        placeholder="Search your book..."
        endContent={
          <button className="focus:outline-none" type="submit">
            <IoMdSearch size={24} />
          </button>
        }
        className="w-full"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />
    </form>
  );
};

export default SearchForm;

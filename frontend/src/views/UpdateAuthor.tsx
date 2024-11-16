import { FC, useEffect, useState } from "react";
import AuthorForm, {
  AuthorInfo,
  InitialState,
} from "../components/common/AuthorForm";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import { parseError } from "../utils/helper";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

interface Props {}

const UpdateAuthor: FC<Props> = () => {
  const [busy, setBusy] = useState(true);
  const [profileInfo, setProfileInfo] = useState<InitialState>();
  const { profile } = useAuth();

  const handleSubmit = async (data: AuthorInfo) => {
    const res = await client.patch("/author", data);
    if (res.data) {
      toast.success(res.data.message);
    }
  };

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      try {
        const { data } = await client.get(`/author/${profile?.authorId}`);
        setProfileInfo(data);
      } catch (error) {
        parseError(error);
      } finally {
        setBusy(false);
      }
    };

    fetchAuthorInfo();
  }, [profile?.authorId]);

  if (busy) return <LoadingSpinner />;

  return (
    <AuthorForm
      onSubmit={handleSubmit}
      initialState={profileInfo}
      btnTitle="Update Bio"
    />
  );
};

export default UpdateAuthor;

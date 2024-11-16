import { FC } from "react";
import AuthorForm, { AuthorInfo } from "../components/common/AuthorForm";
import client from "../api/client";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";

interface Props {}

const NewAuthorRegistration: FC<Props> = () => {
  const dispatch = useDispatch();
  const { profile } = useAuth();

  const isAuthor = profile?.role === "author";

  const handleSubmit = async (data: AuthorInfo) => {
    const res = await client.post("/author/register", data);
    if (res.data) {
      dispatch(updateProfile(res.data.user));
      toast.success(res.data.message);
    }
  };

  if (isAuthor) return <Navigate to="/profile" />;

  return <AuthorForm onSubmit={handleSubmit} btnTitle="Became an Author" />;
};

export default NewAuthorRegistration;

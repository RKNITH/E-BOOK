import { FC } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

interface Props {}

const Author: FC<Props> = () => {
  const { profile } = useAuth();
  const isAuthor = profile?.role === "author";

  return isAuthor ? <Outlet /> : <Navigate to="/not-found" />;
};

export default Author;

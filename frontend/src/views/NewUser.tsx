import { FC } from "react";
import client from "../api/client";
import NewUserForm from "../components/profile/NewUserForm";
import { parseError } from "../utils/helper";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/auth";

interface Props {}

const NewUser: FC<Props> = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (formData: FormData) => {
    try {
      const { data } = await client.put("/auth/profile", formData);
      dispatch(updateProfile(data.profile));
      navigate("/");
    } catch (error) {
      parseError(error);
    }
  };

  if (profile?.signedUp) return <Navigate to="/" />;

  return (
    <NewUserForm
      onSubmit={handleSubmit}
      title="You are almost there, Please fill out the form below."
      btnTitle="Sign Me Up"
    />
  );
};

export default NewUser;

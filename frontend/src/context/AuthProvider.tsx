import { createContext, FC, ReactNode, useEffect } from "react";
import {
  AuthState,
  getAuthState,
  updateAuthStatus,
  updateProfile,
} from "../store/auth";
import client from "../api/client";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  children: ReactNode;
}

export interface IAuthContext {
  profile: AuthState["profile"];
  status: AuthState["status"];
  signOut(): void;
}

export const AuthContext = createContext<IAuthContext>({
  profile: null,
  status: "unauthenticated",
  signOut() {},
});

const AuthProvider: FC<Props> = ({ children }) => {
  const { profile, status } = useSelector(getAuthState);
  const dispatch = useDispatch();

  const signOut = async () => {
    try {
      dispatch(updateAuthStatus("busy"));
      await client.post("/auth/logout");
      dispatch(updateAuthStatus("unauthenticated"));
      dispatch(updateProfile(null));
    } catch (error) {
      console.log(error);
      dispatch(updateAuthStatus("unauthenticated"));
    }
  };

  useEffect(() => {
    client
      .get("/auth/profile")
      .then(({ data }) => {
        dispatch(updateProfile(data.profile));
        dispatch(updateAuthStatus("authenticated"));
      })
      .catch(() => {
        dispatch(updateProfile(null));
        dispatch(updateAuthStatus("unauthenticated"));
      });
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ profile, status, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./index";

export interface Profile {
  id: string;
  name?: string;
  email: string;
  role: "user" | "author";
  avatar?: string;
  signedUp: boolean;
  authorId?: string;
  books?: string[];
}

export interface AuthState {
  profile: Profile | null;
  status: "busy" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  status: "busy",
  profile: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile(state, { payload }: PayloadAction<Profile | null>) {
      state.profile = payload;
    },
    updateAuthStatus(state, { payload }: PayloadAction<AuthState["status"]>) {
      state.status = payload;
    },
  },
});

export const { updateProfile, updateAuthStatus } = slice.actions;

export const getAuthState = createSelector(
  (state: RootState) => state,
  (state) => state.auth
);

export default slice.reducer;

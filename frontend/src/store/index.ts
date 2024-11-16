import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth";
import cartReducer from "./cart";

const reducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;

export default store;

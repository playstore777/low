import { combineReducers, configureStore } from "@reduxjs/toolkit";
import PostSlice, { InitialState } from "./slices/postSlice";
import ThemeSlice from "./slices/themeSlice";
import { Post } from "../types/types";

const combinedReducer = combineReducers({
  post: PostSlice.reducer,
  theme: ThemeSlice.reducer,
});

export const store = configureStore({
  reducer: combinedReducer,
});

export function setupStore(preloadedState: object | undefined) {
  return configureStore({
    reducer: combinedReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

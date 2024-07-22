import { combineReducers, configureStore } from "@reduxjs/toolkit";
import PostSlice from "./slices/postSlice";
import ThemeSlice from "./slices/themeSlice";

const combinedReducer = combineReducers({
  post: PostSlice.reducer,
  theme: ThemeSlice.reducer,
});

export const store = configureStore({
  reducer: combinedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

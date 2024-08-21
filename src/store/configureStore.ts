import { combineReducers, configureStore } from "@reduxjs/toolkit";

import ThemeSlice from "./slices/themeSlice";
import PostSlice from "./slices/postSlice";

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

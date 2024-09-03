import { combineReducers, configureStore } from "@reduxjs/toolkit";

import ThemeSlice from "./slices/themeSlice";
import PostSlice from "./slices/postSlice";
import FontTypeSlice from "./slices/fontTypeSlice";

const combinedReducer = combineReducers({
  post: PostSlice.reducer,
  theme: ThemeSlice.reducer,
  fontType: FontTypeSlice.reducer,
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

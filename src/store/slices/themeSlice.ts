import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";

type InitialState = {
  theme: string;
};

const initialState: InitialState = {
  theme: "",
};

const ThemeSlice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { changeTheme } = ThemeSlice.actions;
export const showPost = (state: RootState) => state.post;

export default ThemeSlice;

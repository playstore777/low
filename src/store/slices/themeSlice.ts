import { createSlice } from "@reduxjs/toolkit";

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

export default ThemeSlice;

import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  fontType: string;
};

const initialState: InitialState = {
  fontType: "normal",
};

const FontTypeSlice = createSlice({
  name: "fontTypeSlice",
  initialState,
  reducers: {
    changeFontType: (state, action) => {
      state.fontType = action.payload;
    },
  },
});

export const { changeFontType } = FontTypeSlice.actions;

export default FontTypeSlice;

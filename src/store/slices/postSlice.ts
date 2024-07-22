import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";

type InitialState = {
  activePost: {
    title: string;
    content: string;
    isEditMode?: boolean;
  };
};

const initialState: InitialState = {
  activePost: {
    title: "",
    content: "",
    isEditMode: false,
  },
};

const PostSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {
    createPost: (state, action) => {
      state.activePost = { ...state.activePost, ...action.payload };
    },
    deletePost: (state) => {
      state.activePost = { ...initialState.activePost };
    },
    enableEditMode: (state) => {
      state.activePost.isEditMode = true;
    },
    disableEditMode: (state) => {
      state.activePost.isEditMode = false;
    },
  },
});

export const { createPost, deletePost, enableEditMode, disableEditMode } =
  PostSlice.actions;
export const showPost = (state: RootState) => state.post;

export default PostSlice;

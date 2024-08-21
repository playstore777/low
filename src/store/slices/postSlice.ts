import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../configureStore";
import { Comment, Post } from "../../types/types";

export type InitialState = {
  activePost: {
    title: string;
    content: string;
    isEditMode?: boolean;
    comments?: Comment[];
  };
  allPosts: Post[];
};

const initialState: InitialState = {
  activePost: {
    title: "",
    content: "",
    isEditMode: false,
  },
  allPosts: [],
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
    uploadAllPosts: (state, action) => {
      // Avoid duplication
      const newPostIds = action.payload.map((post: Post) => post.id);
      const filteredPrevPosts = state.allPosts.filter(
        (post) => !newPostIds.includes(post.id)
      );
      state.allPosts = [...filteredPrevPosts, ...action.payload];
    },
    // updateCommentsAndReplies: (state, action) => {
    //   state.activePost = { ...state.activePost, ...action.payload };
    // },
    enableEditMode: (state) => {
      state.activePost.isEditMode = true;
    },
    disableEditMode: (state) => {
      state.activePost.isEditMode = false;
    },
  },
});

export const {
  createPost,
  deletePost,
  uploadAllPosts,
  enableEditMode,
  disableEditMode,
} = PostSlice.actions;
export const showPost = (state: RootState) => state.post;

export default PostSlice;
